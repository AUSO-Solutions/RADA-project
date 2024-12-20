import { Button } from 'Components'
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { openModal } from 'Store/slices/modalSlice'


const Note = ({ title = "Highlight", btnText = "Save Note", onSave = () => null , defaultValue=""}) => {

    const dispatch = useDispatch()
    const NoteBox = () => {
        const note = useRef({value:'999njb'})
        const saveNote = () => {
            if(!note.current?.value){
                toast.error("Please provide a note")
                return
            }
            onSave(note.current?.value)
            // console.log('',)
        }
        return (
            <div className=' flex flex-col  '>
                <textarea  defaultValue={defaultValue} ref={note} className='w-[400px] p-2 border outline-none h-[100px] rounded-[12px]'>

                </textarea><br />
                <Button onClick={saveNote}>{btnText}</Button>
            </div>
        )
    }
    const openNoteBox = () => {
        dispatch(openModal({ title, component: <NoteBox /> }))
    }
    return (
        <>
            <Button onClick={openNoteBox} className={''}>Add highlight</Button>

        </>
    )
}

export default Note