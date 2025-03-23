import { Api } from "@shared/api";
import { AxiosError } from "axios";

type UploadImageResponseType = {
    data: { url: string }
    status: number
}

export const uploadImage = async (image: File): Promise<UploadImageResponseType> => {
    try {
        const response = await Api.post<{ url: string }>(
            "https://api.imgbb.com/1/upload/",
            { image },
            {
                params: {
                    key: import.meta.env.VITE_IMAGE_UPLOAD_KEY,
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        const { data, status } = response;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as UploadImageResponseType;

        return { data, status };
    }
};
