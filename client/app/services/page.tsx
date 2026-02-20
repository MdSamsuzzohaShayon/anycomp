'use client';

import { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/ToastContext';
import Image from 'next/image';
import EditSpecialistPanel from '@/components/EditSpecialistPanel';
import { IPlatformFee, IServiceOfferingMasterList, ISpecialist, ISpecialistFormData } from '@/types';
import { SpecialistApiService } from '@/api/specialist.api';
import { ApiError } from '@/api/apiClient';
import PublishConfirmationModal from '@/components/PublishConfirmationModal';
import SpecialistServicePreview from '@/components/SpecialistServicePreview';
import { PlatformFeeApiService } from '@/api/platform-fee';


/* ======================================================
   Types
====================================================== */

type SavedSnapshot = {
  formData: ISpecialistFormData;
  offerings: IServiceOfferingMasterList[];
};

// Only the fields we can PATCH (excludes images — handle separately)
type PatchableFormFields = Omit<ISpecialistFormData, 'images'>;


/* ======================================================
   Diff Utility (pure function — O(k) where k = # of keys)
====================================================== */

/**
 * Returns only the keys whose values differ between next and prev.
 * Works on flat objects only (ISpecialistFormData is flat).
 */
function diffFormData(
  prev: PatchableFormFields,
  next: PatchableFormFields
): Partial<PatchableFormFields> {
  const changed: Partial<PatchableFormFields> = {};
  (Object.keys(next) as Array<keyof PatchableFormFields>).forEach((key) => {
    if (next[key] !== prev[key]) {
      // Type assertion needed because TS can't narrow key → value pair automatically
      (changed as Record<string, unknown>)[key] = next[key];
    }
  });
  return changed;
}

/**
 * Returns offering IDs that were added vs removed.
 * O(n) using a Set.
 */
function diffOfferings(
  prev: IServiceOfferingMasterList[],
  next: IServiceOfferingMasterList[]
): { added: string[]; removed: string[]; changed: boolean } {
  const prevSet = new Set(prev.map((o) => o.id));
  const nextSet = new Set(next.map((o) => o.id));

  const added = next.filter((o) => !prevSet.has(o.id)).map((o) => o.id);
  const removed = prev.filter((o) => !nextSet.has(o.id)).map((o) => o.id);

  return { added, removed, changed: added.length > 0 || removed.length > 0 };
}


/* ======================================================
   Small Reusable Components
====================================================== */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader = memo(({ title, subtitle }: SectionHeaderProps) => (
  <div className="mt-4">
    <h4 className="text-2xl md:text-3xl font-bold font-[Red_hat_display]">{title}</h4>
    {subtitle && <p className="mt-2 text-lg text-[#888888]">{subtitle}</p>}
    <hr className="border-b border-gray-300/50 mt-8" />
  </div>
));
SectionHeader.displayName = 'SectionHeader';

const CompanySecretaryCard = memo(() => (
  <div className="mt-4">
    <h4 className="text-2xl md:text-3xl font-bold font-[Red_hat_display]">Company Secretary</h4>
    <div className="w-full flex flex-col md:flex-row justify-between items-start mt-2 gap-6">
      <div className="w-full md:w-1/2">
        <div className="flex items-center gap-x-3">
          <div className="w-16 h-16 md:w-18 md:h-18">
            <Image src="/man.jpeg" height={100} width={100} alt="a-man" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h4 className="text-lg md:text-xl font-semibold flex items-center gap-x-2">
              Grace Lam
              <span className="flex items-center gap-x-1 text-xs text-gray-400">
                <Image width={20} height={20} alt="verified-icon" src="/icons/verified.svg" className="w-4 h-4" />
                Verified
              </span>
            </h4>
            <p className="mb-2">Corpsec Services Sdn Bhd</p>
            <button className="px-3 md:px-4 py-2 bg-[#222222] text-white rounded-sm hover:bg-blue-900 transition-colors text-sm font-medium">
              View Profile
            </button>
          </div>
        </div>
        <p className="text-sm mt-6">
          A company secretarial service founded by Grace, who believes that every company deserves clarity,
          confidence, and care in their compliance journey.
        </p>
      </div>
      <div className="w-full md:w-1/2">
        <h4 className="text-lg md:text-xl font-semibold">Corpsec Services Sdn Bhd</h4>
        <div className="flex gap-x-2 mt-2">
          <Image src="/company-1.png" height={50} width={50} alt="company" />
          <Image src="/company-2.png" height={50} width={50} alt="company" />
          <Image src="/company-3.png" height={50} width={50} alt="company" />
        </div>
      </div>
    </div>
  </div>
));
CompanySecretaryCard.displayName = 'CompanySecretaryCard';

const FeeCard = ({ basePrice = 0, precessingFee = 0 }: { basePrice: number; precessingFee: number }) => (
  <div className="shadow-lg mt-2">
    <div className="p-6 md:p-12">
      <h2 className="text-2xl md:text-3xl font-bold">Professional Fee</h2>
      <p>Set a rate for your service</p>
      <div className="w-full flex justify-center items-center py-8 md:py-12">
        <h3 className="text-4xl md:text-5xl font-semibold border-b w-fit">RM {basePrice + precessingFee}</h3>
      </div>
      <div className="flex flex-col gap-y-3">
        <Row label="Base Price" value={`RM ${basePrice}`} />
        <Row label="Service Processing Fee" value={`RM ${precessingFee}`} underline />
        <Row label="Total" value={`RM ${basePrice + precessingFee}`} border />
        <Row label="Your Returns" value={`RM ${basePrice}`} />
      </div>
    </div>
  </div>
);
FeeCard.displayName = 'FeeCard';

interface RowProps {
  label: string;
  value: string;
  underline?: boolean;
  border?: boolean;
}

const Row = ({ label, value, underline, border }: RowProps) => (
  <div className={`w-full flex justify-between items-center ${border ? 'pb-2 border-b border-gray-300' : ''}`}>
    <span className={underline ? 'underline' : ''}>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);


/* ======================================================
   Initial / empty state (defined once outside component
   so it's a stable reference — avoids re-creating on
   every render)
====================================================== */

const INITIAL_FORM_DATA: ISpecialistFormData = {
  title: '',
  description: '',
  amount: 0,
  currency: '',
  duration_days: 0,
  is_draft: false,
  images: [],
  services: [],
};

const INITIAL_OFFERINGS: IServiceOfferingMasterList[] = [];


/* ======================================================
   Main Page
====================================================== */

export default function ServicesPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const imageRef = useRef<File[]>([]);
  const topPreviewImageRef = useRef<string>('/service-company-1.jpg');
  const bottomPreviewImageRef = useRef<string>('/service-company-2.jpg');

  // ── UI state ──────────────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // ── Domain state ──────────────────────────────────────
  const [formData, setFormData] = useState<ISpecialistFormData>(INITIAL_FORM_DATA);
  const [selectedOfferings, setSelectedOfferings] = useState<IServiceOfferingMasterList[]>(INITIAL_OFFERINGS);
  const [tiers, setTiers] = useState<IPlatformFee[]>([]);
  const [specialistId, setSpecialistId] = useState<string | null>(null);

  /**
   * `savedSnapshot` is null until the first successful API create.
   * After create/update it holds the last successfully persisted state
   * so we can diff against it on the next save attempt.
   */
  const [savedSnapshot, setSavedSnapshot] = useState<SavedSnapshot | null>(null);

  // Derived flag — cleaner than a separate boolean isUpdate state
  const isUpdate = savedSnapshot !== null;


  // ── Platform fee (memoised) ───────────────────────────
  const platformFee = useMemo(() => {
    const tier = tiers.find(
      (t) => formData.amount >= t.min_value && formData.amount <= t.max_value
    );
    if (!tier) return { tier: null, fee: 0 };
    return { tier, fee: Math.round((formData.amount * tier.platform_fee_percentage) / 100) };
  }, [tiers, formData.amount]);


  // ── Fetch tiers once ──────────────────────────────────
  useEffect(() => {
    PlatformFeeApiService.getAll()
      .then(setTiers)
      .catch(console.error);
  }, []);

  // ── Auth guard ────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, [router]);


  // ── Handlers ─────────────────────────────────────────
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleEditPanelClose = useCallback(() => setIsEditPanelOpen(false), []);
  const handlePublishModalClose = useCallback(() => setIsPublishModalOpen(false), []);

  const handleEditSpecialist = useCallback(
    async (data: FormData): Promise<void> => {
      try {
        success('Specialist updated successfully!');
        setIsEditPanelOpen(false);
      } catch (err) {
        const apiError = err as ApiError;
        error(apiError.message || 'Failed to update specialist');
        throw err;
      }
    },
    [error, success]
  );

  const handleConfirmEditing = useCallback(
    async (
      e: React.SyntheticEvent,
      so: IServiceOfferingMasterList[],
      ir: React.RefObject<File[]>,
      fd: ISpecialistFormData
    ): Promise<void> => {
      e.preventDefault();

      // ── Validate ────────────────────────────────────
      if (!fd.title.trim() || !fd.description.trim() || fd.amount <= 0 || fd.duration_days <= 0) {
        error('Please fill in all required fields correctly.');
        return;
      }

      // ── Sync local state ────────────────────────────
      setSelectedOfferings(so);
      imageRef.current = ir.current;
      setFormData((prev) => ({ ...prev, ...fd }));
      setIsEditPanelOpen(false);

      setIsPublishing(true);

      try {
        if (isUpdate && savedSnapshot && specialistId) {
          /* ── UPDATE PATH ──────────────────────────────
             Only send fields that actually changed.
             This avoids unnecessary data transfer and
             prevents accidental overwrites.          */

          // Separate images from the rest (images need special handling)
          const { images: _newImages, ...nextFields } = fd;
          const { images: _prevImages, ...prevFields } = savedSnapshot.formData;

          const changedFields = diffFormData(prevFields, nextFields);
          const offeringDiff = diffOfferings(savedSnapshot.offerings, so);

          const hasFieldChanges = Object.keys(changedFields).length > 0;
          const hasImageChanges = ir.current.length > 0; // new files queued
          const hasChanges = hasFieldChanges || offeringDiff.changed || hasImageChanges;

          if (!hasChanges) {
            success('No changes detected.');
            setIsPublishing(false);
            return;
          }

          const form = new FormData();

          // Append only changed scalar fields
          if (changedFields.title !== undefined) form.append('title', changedFields.title as string);
          if (changedFields.description !== undefined) form.append('description', changedFields.description as string);
          if (changedFields.duration_days !== undefined) form.append('duration_days', String(changedFields.duration_days));
          if (changedFields.amount !== undefined) form.append('base_price', String(changedFields.amount));
          if (changedFields.is_draft !== undefined) form.append('is_draft', String(changedFields.is_draft));

          // Always send full offering list if it changed (simpler for the API)
          if (offeringDiff.changed) {
            form.append('services', JSON.stringify(so.map((o) => o.id)));
          }

          // New image files only
          if (hasImageChanges) {
            ir.current.forEach((file) => form.append('images', file));
          }

          // TODO: replace 'SPECIALIST_ID' with the real persisted ID
          await SpecialistApiService.update(specialistId, form);

          success('Specialist updated successfully!');

        } else {
          /* ── CREATE PATH ──────────────────────────────
             First-time save — send everything.         */

          const form = new FormData();
          form.append('title', fd.title);
          form.append('description', fd.description);
          form.append('duration_days', String(fd.duration_days));
          form.append('base_price', String(fd.amount));
          form.append('is_draft', 'true');
          form.append('services', JSON.stringify(so.map((o) => o.id)));
          ir.current.forEach((file) => form.append('images', file));

          const response = await SpecialistApiService.create(form);
          setSpecialistId(response?.id || null);
          success('Specialist published successfully!');
        }

        // ── Persist snapshot of what was just saved ──
        setSavedSnapshot({ formData: fd, offerings: so });

      } catch (err) {
        const apiError = err as ApiError;
        if (apiError?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
        error(apiError.message || 'Failed to save specialist');
        console.error('Error saving specialist:', err);
      } finally {
        setIsPublishModalOpen(false);
        setIsPublishing(false);
      }
    },
    [error, isUpdate, router, savedSnapshot, success, specialistId]
  );

  const handleConfirmPublish = useCallback(async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    try {

      if (!specialistId) {
        throw new Error("Specialist has not been created yet and cannot be published.");
      }


      const form = new FormData();
      form.append('is_draft', 'false');

      const response = await SpecialistApiService.update(specialistId, form);
      setSpecialistId(response?.id || null);
      success('Specialist published successfully!');
      router.push("/");


    } catch (err) {
      const apiError = err as ApiError;
      if (apiError?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
      error(apiError.message || 'Failed to save specialist');
      console.error('Error saving specialist:', err);
    } finally {
      setIsPublishModalOpen(false);
      setIsPublishing(false);
    }
  }, [specialistId]);


  /* ======================================================
     Render
  ====================================================== */

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="flex-1 overflow-auto relative min-w-0">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 p-6 md:p-12 mt-6 md:mt-12">
          {/* LEFT */}
          <div className="w-full lg:w-4/6">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {formData.title || 'Register a new company | Private Limited - Sdn Bhd'}
            </h2>

            <SpecialistServicePreview
              topImage={topPreviewImageRef}
              bottomImage={bottomPreviewImageRef}
              imageRef={imageRef}
            />

            <SectionHeader
              title="Description"
              subtitle={formData.description || 'Describe your service here'}
            />

            {selectedOfferings.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-2xl md:text-3xl font-bold font-[Red_hat_display]">Additional Offerings</h4>
                {selectedOfferings.map((o) => (
                  <p key={o.id} className="mt-2 text-lg text-[#888888] rounded-lg bg-gray-300 w-fit px-2">
                    {o.title}
                  </p>
                ))}
              </div>
            ) : (
              <SectionHeader
                title="Additional Offerings"
                subtitle="Enhance your service by adding additional offerings"
              />
            )}

            <CompanySecretaryCard />
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-2/6">
            <div className="flex items-center gap-x-2">
              <button
                onClick={() => setIsEditPanelOpen(true)}
                className="px-4 py-2 bg-[#222222] text-white rounded-sm hover:bg-blue-900 transition-colors text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => setIsPublishModalOpen(true)}
                className="px-4 py-2 bg-[#002F70] text-white rounded-sm hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Publish
              </button>
            </div>

            <FeeCard basePrice={formData.amount} precessingFee={platformFee.fee} />
          </div>
        </div>
      </main>

      <EditSpecialistPanel
        isOpen={isEditPanelOpen}
        onClose={handleEditPanelClose}
        onConfirm={handleConfirmEditing}
      />

      <PublishConfirmationModal
        isOpen={isPublishModalOpen}
        onClose={handlePublishModalClose}
        onConfirm={handleConfirmPublish}
        isPublishing={isPublishing}
      />
    </div>
  );
}