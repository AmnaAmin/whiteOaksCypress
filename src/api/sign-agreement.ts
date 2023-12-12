import axios from "axios";

export type SignatureDocument = {
    fileObjectContentType: string,
    fileType: string,
    fileObject: string
}

export const signAgreementClient = async (payload: SignatureDocument,token:string) => {
    

    const apiUrl = "/api/agreement";

    return axios.post(apiUrl, JSON.stringify(payload), {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
}