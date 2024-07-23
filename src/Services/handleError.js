import { toast } from "react-toastify"

export default (error, type = "error") => {
    toast[type](error?.message || "An error occured")
}