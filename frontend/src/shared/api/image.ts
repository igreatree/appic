import { Api } from "@shared/api";
import { AxiosError } from "axios";

type UploadImageResponseType = {
    data: { url: string, width: number, height: number }
    status: number
}

export const uploadImage = async (image: File): Promise<UploadImageResponseType> => {
    try {
        const response = await Api.post<UploadImageResponseType>(
            "projects/uploadImage/",
            { image },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        const { data, status } = response.data;

        return { data, status };
    } catch (e) {
        console.error(e);
        const error = e as AxiosError
        const { status, data } = error.response as UploadImageResponseType;

        return { data, status };
    }
};
