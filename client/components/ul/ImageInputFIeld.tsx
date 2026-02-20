import { Trash2, X } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState, useEffect } from 'react';

interface IImageInputFieldProps {
  imageRef: React.RefObject<File | null>;
  serial: number;
}

function ImageInputField({ imageRef, serial }: IImageInputFieldProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Sync local state -> parent ref
  useEffect(() => {
    imageRef.current = file;
  }, [file, imageRef]);

  const handleRemoveImage = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <div className="w-full mb-8">
      <h4 className="block text-sm">
        Service - Image ({serial === 1 ? "1st" : serial === 2 ? "2nd" : serial === 3 ? "3rd" : `${serial}th`})
      </h4>

      <div className="flex items-center gap-x-2">
        <Image width={20} height={20} src="/icons/exclamation.svg" alt="exclamation" className="w-6" />
        <p className="text-xs text-gray-400">Maximum of 1 Image</p>
      </div>

      <div
        className="w-full border-3 border-dashed border-black
                   flex flex-col items-center justify-center gap-y-1 p-2
                   hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
        onClick={handleInputClick}
      >
        <Image
          height={200}
          width={200}
          src="/icons/upload.svg"
          alt="upload"
          className="w-8 opacity-70"
        />

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept="image/png, image/jpeg, image/jpg, image/webp"
        />

        <button
          type="button"
          className="px-2 py-1 bg-[#002F70] text-white text-sm rounded-md hover:bg-blue-800 transition"
        >
          Browse
        </button>

        <p className="text-xs text-gray-400">OR</p>
        <p className="text-sm text-gray-500">Drag a file to upload</p>
      </div>

      <p className="mt-2 text-xs text-gray-400 font-medium">
        Accepted formats: JPG, JPEG, PNG or WEBP • Max size: 4MB
      </p>

      {/* Image Preview */}
      {file && (
        <div className="shadow-lg overflow-hidden flex justify-between items-center p-2 mt-3">
          <Image
            height={200}
            width={200}
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-12 h-10 object-cover"
          />

          <div className="text-xs text-gray-500">
            <p>{file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(1)} KB</p>
            <p>Type: {file.type}</p>
          </div>

          <button
            type="button"
            className="w-5 h-5 flex items-center justify-center text-white"
            onClick={handleRemoveImage}
          >
            <Trash2 className='w-3 h-3 text-gray-500' />
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageInputField;
