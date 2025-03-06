import { Camera, Check, Trash2 } from "lucide-react";
import { userFirebase } from "../context/Firebase";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  Crop,
  makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "./setCanvasPreview";

type ImageCropperProps = {
  profileImageRef: React.MutableRefObject<string | null>;
  canChooseNewFile?: boolean;
  isPPRemoved?: boolean;
};

const MIN_DIMENSION = 150;
const ASPECT_RATIO = 1;

const ImageCropper = ({
  profileImageRef,
  canChooseNewFile = true,
}: ImageCropperProps) => {
  const firebase = userFirebase();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPPRemoved, setIsPPRemoved] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });

  useEffect(() => {
    if (profileImageRef.current) {
      setIsPPRemoved(false);
    } else {
      setIsPPRemoved(true);
    }
  }, [profileImageRef.current]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageBytesData = reader.result as string;
        const imageElement = new Image();
        imageElement.src = imageBytesData;

        imageElement.addEventListener("load", (e: Event) => {
          const img = e.currentTarget as HTMLImageElement;
          const { naturalWidth, naturalHeight } = img;

          if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
            toast.error("Image must be at least 150 x 150 pixels", {
              position: "bottom-right",
            });
            return setImage(null);
          }
        });

        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropwidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropwidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleRemoveProfilePictureClick = () => {
    setIsPPRemoved(true);
    profileImageRef.current = null;
  };

  return (
    <div className="w-full h-full ">
      {!image ? (
        <div
          style={{
            background: firebase?.userGradient,
          }}
          className="relative flex items-center justify-center w-32 h-32 mx-auto overflow-hidden rounded-full cursor-pointer group"
        >
          {canChooseNewFile && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
            />
          )}

          {profileImageRef.current && (
            <>
              <img
                src={profileImageRef.current}
                alt="Avatar"
                className="absolute object-cover w-full h-full rounded-full"
              />
            </>
          )}

          {canChooseNewFile && (
            <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
              <Camera className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <div
            onClick={() => {
              if (!imgRef.current || !canvasRef.current) {
                return;
              }
              setCanvasPreview(
                imgRef.current,
                canvasRef.current,
                convertToPixelCrop(
                  crop,
                  imgRef.current.width,
                  imgRef.current.height
                )
              );
              const croppedImageBytesData = canvasRef.current.toDataURL();
              profileImageRef.current = croppedImageBytesData;
              setImage(null);
              setIsPPRemoved(false);
            }}
            title="Crop Image"
            className="absolute right-0 top-[-40px] z-10 bg-gray-200 cursor-pointer group mt-4 "
          >
            <Check className=" group-hover:text-secondary" />
          </div>
          <ReactCrop
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            crop={crop}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              onLoad={onImageLoad}
              src={image}
              alt="uploaded image"
            />
          </ReactCrop>

          <canvas ref={canvasRef} className="hidden " />
        </div>
      )}
      {canChooseNewFile && !isPPRemoved && (
        <div className="flex flex-col items-center mt-5 ">
          <div title="Remove Photo" onClick={handleRemoveProfilePictureClick}>
            <Trash2 className="w-5 h-5 cursor-pointer hover:text-red-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
