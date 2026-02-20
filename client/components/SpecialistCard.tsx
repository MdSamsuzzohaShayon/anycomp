import { formatPrice } from "@/utils/helpers";
import { ISpecialist } from "@/types";
import { useMemo, useState } from "react";

interface SpecialistCardProps {
  readonly specialist: ISpecialist;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ specialist }) => {
  const [hovered, setHovered] = useState<boolean>(false);

  /**
   * ─────────────────────────────────────────────
   * MEDIA RESOLUTION (Cloudflare R2)
   * ─────────────────────────────────────────────
   */
// https://pub-567dbbfa3a8c401aa9d9ff1baa08c70e.r2.dev/00e07680-b230-483a-9809-0cc320389fcb.jpg
  const coverImage = useMemo(() => {
    if (!specialist.media || specialist.media.length === 0) return null;

    const cover = specialist.media
      .filter((m) => m.media_type === "image")
      .sort((a, b) => a.display_order - b.display_order)[0];

    return cover?.file_name ? `${process.env.NEXT_PUBLIC_S3_DEVELOPMENT_URL}/${cover?.file_name}` : null;
  }, [specialist.media]);

  const avatarImage = useMemo(() => {
    if (!specialist.media) return null;

    // const avatar = specialist.media.find(
    //   (m) => m.media_type === "avatar"
    // );

    // return avatar?.file_url ?? null;
    return null;
  }, [specialist.media]);

  /**
   * ─────────────────────────────────────────────
   * SERVICE RESOLUTION
   * ─────────────────────────────────────────────
   */

  const primaryService = useMemo(() => {
    return specialist.service_offerings?.[0]?.serviceOfferingMaster ?? null;
  }, [specialist.service_offerings]);

  /**
   * ─────────────────────────────────────────────
   * SAFE VALUES
   * ─────────────────────────────────────────────
   */

  const price =
    typeof specialist.final_price === "number"
      ? specialist.final_price
      : Number(specialist.final_price) || 0;

  const firstName =
    specialist.title?.split(" ")[0] ?? specialist.title ?? "Specialist";

  const serviceTitle = primaryService?.title ?? "General Service";

  const fallbackCover = `https://picsum.photos/seed/${specialist.id}/600/400`;
  const fallbackAvatar = `https://i.pravatar.cc/150?u=${specialist.id}`;

  /**
   * ─────────────────────────────────────────────
   * RENDER
   * ─────────────────────────────────────────────
   */

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`overflow-hidden cursor-pointer transition-all duration-200 rounded-2xl font-[Proxima_Nova] ${
        hovered ? "shadow-lg transform -translate-y-1" : ""
      }`}
    >
      {/* Cover image */}
      <div
        className="w-full overflow-hidden relative"
        style={{ aspectRatio: "4 / 3" }}
      >
        <img
          src={coverImage ?? fallbackCover}
          alt={specialist.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 rounded-2xl ${
            hovered ? "scale-105" : "scale-100"
          }`}
        />
      </div>

      {/* Card content */}
      <div className="p-2">
        {/* Profile section */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
            <img
              src={avatarImage ?? fallbackAvatar}
              alt={firstName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 text-sm truncate">
              <span className="font-semibold">{firstName}</span>
              - <span>{serviceTitle}</span>
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm leading-relaxed mb-2 font-medium line-clamp-2">
          {specialist.description ??
            `Register your company with a trusted ${serviceTitle}`}
        </p>

        {/* Price */}
        <div className="text-2xl font-bold text-gray-900 uppercase">
          RM {formatPrice(price)}
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;