import { toast } from "react-toastify"

export default function handleError (error, type = "error") {
    toast[type](error?.message || "An error occured")
}