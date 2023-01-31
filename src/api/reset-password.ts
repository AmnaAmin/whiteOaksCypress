import { useMutation } from "react-query";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export type ResestPasswordFinish = {
    key: string;
    newPassword: string;
}

export const useResetPassword = () => {

    const apiUrl = "api/account/reset-password/finish";

    const toast = useToast();

    //eslint-disable-next-line
    const navigate = useNavigate();

    return useMutation( ( payload: ResestPasswordFinish ) => {

        return axios.post( apiUrl, payload );

    }, {
        onSuccess: () => {
            navigate("/login");
            toast({
                title: 'Password Changed Successfully.',
                position: 'top-left',
                status: 'success',
            })
        },
        onError: (error: any) => {
            toast.closeAll();
            toast({
                title: `${error.response?.data?.title}: ${error.response?.data?.detail}`,
                position: 'top-left',
                status: 'error',
              })
        }
    } )

}
export const useResetPasswordSendEmail = () => {

    const apiUrl = "api/account/reset-password/init";

    const toast = useToast();

    return useMutation( ( email: string ) => {
        return axios.post( apiUrl, email, { headers: { 'Content-Type': 'text/plain' } } );
    }, {
        onSuccess: () => {
            toast({
                title: "Check your emails for details on how to reset your password.",
                position: "top-left",
                status: "success"
            })
        }
    }
     );

}