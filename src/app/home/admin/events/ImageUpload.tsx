import webClient from "@/api";
import CustomIcon from "@/components/CustomIcon";
import { Spinner } from "@heroui/react";
import clsx from "clsx";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

/* ---------------------------------- Icons --------------------------------- */
import icFileUpload from "@iconify/icons-ic/outline-cloud-upload";
import imageIcon from "@iconify/icons-ic/outline-image";

interface ImageUploadProps {
    name: string;
    label: string;
    required?: boolean;
    defaultValue?: string;
}

export default function ImageUpload({ name, label, required = true, defaultValue }: ImageUploadProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(defaultValue || null);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [hovering, setHovering] = useState(false);

    const processFile = useCallback(async (file: File) => {
        try {
            setIsUploading(true);
            setError(null);

            const { fileUri } = await webClient.uploadFile({
                data: new Uint8Array(await file.arrayBuffer()),
                filename: file.name,
                bucket: "public",
            });

            setImageUrl(fileUri);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error uploading image";
            setError(errorMessage);
            toast.error(errorMessage);
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    }, []);

    const handleUploadClick = useCallback(async () => {
        if (imageUrl) {
            setImageUrl(null);
            return;
        }

        try {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";

            const filePromise = new Promise<File | null>((resolve) => {
                input.onchange = () => resolve(input.files?.[0] || null);
            });

            input.click();
            const file = await filePromise;

            if (!file) {
                return;
            }

            await processFile(file);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Error uploading image";
            toast.error(errorMessage);
            console.error(err);
        }
    }, [imageUrl, processFile]);

    const handleDrop = useCallback(
        async (e: React.DragEvent<HTMLButtonElement>) => {
            e.preventDefault();
            setIsDragging(false);

            if (imageUrl) {
                toast.error("You can only upload one image, please remove the current image first.");
                return;
            }

            const file = e.dataTransfer.files?.[0];
            if (!file) {
                return;
            }

            await processFile(file);
        },
        [imageUrl, processFile],
    );

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleUploadClick();
            }
        },
        [handleUploadClick],
    );

    return (
        <div className="space-y-2">
            <p className="text-small text-gray-800 dark:text-gray-200 pl-0.5">
                {label}
                {required && <span className="text-red-500">*</span>}
            </p>
            <button
                type="button"
                className={clsx(
                    "relative w-full h-48 bg-default-100 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 border-default-300",
                    {
                        "border-dashed": !imageUrl,
                        "!border-danger-200": error,
                        "!bg-danger-50": error,
                    },
                )}
                onClick={handleUploadClick}
                onKeyDown={handleKeyDown}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragEnter}
                onDrop={handleDrop}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                tabIndex={0}
                aria-label={imageUrl ? "Remove image" : "Upload image"}
            >
                {imageUrl && <img src={imageUrl} alt={label} className="w-full h-full object-cover rounded-lg" />}
                {!imageUrl && !isUploading && (
                    <>
                        <CustomIcon icon={isDragging ? icFileUpload : imageIcon} className="w-12 h-12 text-gray-500" />
                        <p className="text-sm text-gray-500">
                            {isDragging ? "Drop to upload" : "Drag and drop or click to upload"}
                        </p>
                    </>
                )}
                {isUploading && <Spinner size="md" />}
                {hovering && imageUrl && (
                    <div className="absolute top-0 left-0 w-full h-full rounded-lg flex items-center justify-center backdrop-blur-md">
                        <p className="text-sm text-gray-500">Remove image</p>
                    </div>
                )}
            </button>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <input
                name={name}
                value={imageUrl ?? ""}
                onChange={() => {}} // Controlled component needs onChange handler
                className="hidden"
                required={required}
                onInvalid={(e) => {
                    e.preventDefault();
                    setError("Please upload an image");
                }}
            />
        </div>
    );
}
