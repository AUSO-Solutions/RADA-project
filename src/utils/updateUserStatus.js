
import { firebaseFunctions } from "Services";
import { store } from "Store";

// Function to handle visibility change
let offlinetimer = null, onlinetime = null
export const updateStatus = async (status, logoutUid) => {
    const uid = store.getState().auth.user?.data?.uid
    console.log(uid)
    if (uid)
        if (uid) {
            console.log(status);
            document.title = status;
            firebaseFunctions('updateUserStatusByUid', { status, uid })
        }

}

function handleVisibilityChange() {

    if (document.hidden) {
        clearTimeout(onlinetime)
        offlinetimer = setTimeout(() => {
            updateStatus("offline")
        }, 5000)

    }
    else {
        clearTimeout(offlinetimer)
        onlinetime = setTimeout(() => {
            updateStatus("online")
        }, 5000)
    }
}
document.addEventListener('visibilitychange', handleVisibilityChange, false);


window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    // window.prompt('Are you sure you want to leave')
    updateStatus("offline")
    // e.returnValue = ‘’;

}); 

// Initial check
handleVisibilityChange()
// Add a new document in collection "cities"


