import Image from "next/image";

interface SpecialistServicePreviewProps {
  topImage: React.RefObject<string>;
  bottomImage: React.RefObject<string>;
  imageRef: React.RefObject<File[]>;
}

const SpecialistServicePreview = ({ topImage, bottomImage, imageRef }: SpecialistServicePreviewProps) => {
  const [first, ...rest] = imageRef.current;

  // Determine number of images
  const totalImages = imageRef.current.length;

  // Apply responsive class only if images are not exactly 3
  const gridClass =
    totalImages === 3
      ? "grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-2 h-auto md:h-[460px]"
      : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 auto-rows-fr h-auto";

  return (
    <div className={gridClass}>
      {/* Left / First Image */}
      {first ? (
        <div className="md:row-span-2 bg-gray-100 flex justify-center items-center flex-col text-center">
          <Image
            height={200}
            width={200}
            src={URL.createObjectURL(first)}
            alt="empty-image"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="md:row-span-2 bg-gray-100 flex justify-center items-center flex-col text-center p-4">
          <Image
            height={200}
            width={200}
            src="/empty.svg"
            alt="empty-image"
            className="h-12 w-12 object-cover"
          />
          <p className="text-sm text-gray-500">
            Upload an image for your service listing in PNG, JPG or JPEG up to 4MB
          </p>
        </div>
      )}

      {/* Remaining images */}
      {rest && rest.length > 0 ? (
        rest.map((image) => (
          <div className="min-h-[180px]" key={image.name}>
            <Image
              height={200}
              width={200}
              src={URL.createObjectURL(image)}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        ))
      ) : (
        <>
          <div className="min-h-[180px]">
            {topImage && (
              <img src={topImage.current} alt="preview" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="min-h-[180px]">
            {bottomImage && (
              <img
                src={bottomImage.current}
                alt="preview"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SpecialistServicePreview;
