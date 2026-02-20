import React, { useEffect, useMemo, useRef, useState } from "react";
import { IServiceOfferingMasterList, ISpecialistFormData } from "../types";
import { X } from "lucide-react";
import { CURRENCIES } from "@/utils/constants";
import { ServiceOfferingMasterApiService } from "@/api/service-offering-master.api";
import Image from "next/image";
import ImageInputFIeld from "./ul/ImageInputFIeld";

interface IEditSpecialistPanel {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: React.SyntheticEvent, selectedOfferings: IServiceOfferingMasterList[], imageRef: React.RefObject<File[]>, formData: ISpecialistFormData) => void;
}

// Edit Specialist Panel Component (Right Panel)
function EditSpecialistPanel({
  onConfirm,
  isOpen,
  onClose
}: IEditSpecialistPanel) {


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOfferingOpen, setIsOfferingOpen] = useState(false);

  const [offerings, setOfferings] = useState<IServiceOfferingMasterList[]>([]);


  const [isLoadingOfferings, setIsLoadingOfferings] = useState(false);
  const [offeringError, setOfferingError] = useState<string | null>(null);



  // Form Data
  const [selectedOfferings, setSelectedOfferings] = useState<IServiceOfferingMasterList[]>([]);

  // All images
  const image1Ref = useRef<File | null>(null);
  const image2Ref = useRef<File | null>(null);
  const image3Ref = useRef<File | null>(null);

  const [formData, setFormData] = useState<ISpecialistFormData>({
    title: '',
    description: '',
    amount: 0,
    currency: 'MYR',
    duration_days: 0,
    is_draft: true,
    images: [],
    services: []
  });



  const handleSubmit = (e: React.SyntheticEvent) => {
    // Always maintain order: 1 → 2 → 3
    const orderedImages = [
      image1Ref.current,
      image2Ref.current,
      image3Ref.current,
    ].filter((file): file is File => file !== null);

    const organizedImageRef = {
      current: orderedImages,
    };
    onConfirm(e, selectedOfferings, organizedImageRef, formData);
  }

  const filteredOfferings = useMemo(() => {
    return offerings.filter(
      (o) =>
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedOfferings.find((s) => s.id === o.id)
    );
  }, [searchTerm, offerings, selectedOfferings]);


  const handleSelectOffering = (offering: IServiceOfferingMasterList) => {
    setSelectedOfferings((prev) => [...prev, offering]);
    setSearchTerm("");
    setIsOfferingOpen(false);
  };

  const handleRemoveOffering = (id: string) => {
    setSelectedOfferings((prev) => prev.filter((o) => o.id !== id));
  };





  const handleClose = () => {
    setErrors({});
    onClose();
  };



  // Add this useEffect to handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);


  useEffect(() => {
    if (!isOpen) return;

    const fetchOfferings = async () => {
      try {
        setIsLoadingOfferings(true);
        setOfferingError(null);

        const soData = await ServiceOfferingMasterApiService.getAll();
        setOfferings(soData);

      } catch (err) {
        console.error(err);
        setOfferingError('Failed to load offerings');
      } finally {
        setIsLoadingOfferings(false);
      }
    };

    fetchOfferings();
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-900/80 z-40"
        onClick={handleClose}
      />
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col z-50">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-bold text-gray-900">Edit Service</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form start  */}
        <form className="w-full overflow-y-auto" onSubmit={handleSubmit} >
          <div className="flex flex-col w-full items-center gap-y-12 px-6">
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-600"> Title </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-sm focus:ring-2 focus:ring-transparent focus:border-transparent outline-gray-300 bg-white text-gray-900 ${errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Enter your service title"
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}

            </div>


            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-600"> Description </label>
              <textarea
                required
                value={formData.description}
                rows={4}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                  if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-sm focus:ring-2 focus:ring-transparent focus:border-transparent outline-gray-300 bg-white text-gray-900 ${errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Describe your service here"
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}

            </div>


            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-600"> Estimated Completion Time (Days) </label>
              <div
                className="w-full px-4 py-2 border rounded-sm outline-gray-300 border-gray-300 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {formData.duration_days} {formData.duration_days === 1 ? 'day' : 'days'}
              </div>
              {isDropdownOpen && (
                <ul className="absolute z-10 w-[calc(100%-3rem)] md:w-80 bg-white mt-1 p-2 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((days) => (
                    <li
                      key={days}
                      className="p-2 hover:bg-gray-100 w-full cursor-pointer rounded"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, duration_days: days }));
                        if (errors.duration_days) setErrors(prev => ({ ...prev, duration_days: '' }));
                        setIsDropdownOpen(false);
                      }}
                    >
                      {days} {days === 1 ? 'day' : 'days'}
                    </li>
                  ))}
                </ul>
              )}
              {errors.duration_days && (
                <p className="mt-1 text-sm text-red-600">{errors.duration_days}</p>
              )}
            </div>

            {/* Price */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Price
              </label>

              <div className="flex items-center">
                {/* Currency */}
                {/* <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, currency: e.target.value }))
                  }
                  className="h-10 px-3 py-2 border-b border-t border-l border-gray-300 bg-gray-100 outline-gray-300"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="border-gray-300 outline-gray-300">
                      {c.label}
                    </option>
                  ))}
                </select> */}
                <div className="h-10 px-3 py-2 border-b border-t border-l border-gray-300 bg-gray-100 outline-gray-300">🇲🇾 MYR</div>

                {/* Amount */}
                <input
                  type="number"
                  min={0}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: Number(e.target.value) }))
                  }
                  placeholder="Enter amount"
                  className="flex-1 h-10 px-3 py-2 border-t border-b border-r border-gray-300 rounded-sm outline-gray-300"
                />
              </div>
            </div>

            {/* Additional Offerings */}
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Additional Offerings
              </label>

              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOfferingOpen(true);
                  }}
                  placeholder="Search offerings..."
                  className="w-full h-10 px-4 border border-gray-300 rounded-sm outline-gray-300"
                />

                {/* Dropdown */}
                {isOfferingOpen && filteredOfferings.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                    {filteredOfferings.map((offering) => (
                      <div
                        key={offering.id}
                        onClick={() => handleSelectOffering(offering)}
                        className="flex items-start gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                      >
                        <span className="text-lg">ICON</span>
                        <div>
                          <p className="text-sm font-semibold">{offering.title}</p>
                          <p className="text-xs text-gray-500">{offering.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected items */}
              {selectedOfferings.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedOfferings.map((offering) => (
                    <div
                      key={offering.id}
                      className="flex items-center justify-between bg-gray-100 rounded-sm px-3 py-2 gap-x-2"
                    >
                      <p className="text-sm font-semibold">{offering.title}</p>

                      <button
                        type="button"
                        onClick={() => handleRemoveOffering(offering.id)}
                        className="p-1 w-4 h-4 bg-gray-500 hover:bg-red-300 rounded-full flex justify-center items-center"
                      >
                        <X className="w-full h-full text-white hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* // Inside your component, after selectedOfferings section */}
            <div className="images flex flex-col w-full items-center justify-center">
              <ImageInputFIeld imageRef={image1Ref} serial={1} key="image-input-1" />
              <ImageInputFIeld imageRef={image2Ref} serial={2} key="image-input-2" />
              <ImageInputFIeld imageRef={image3Ref} serial={3} key="image-input-3" />
            </div>





          </div>

          <div className="p-6 flex justify-start gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300/50 text-red-600 rounded-sm hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#002F70] text-white rounded-sm hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditSpecialistPanel;

