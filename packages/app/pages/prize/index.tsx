import { TextInput } from "@mantine/core";
import ImageComponent from "../../components/Prize/dropzone";
import { TextEditor } from "../../components/popupComponents/textEditor";
import React from "react";


const Prize = () => {
   return (
    <div className="p-5">
    <ImageComponent />
    <TextInput
    className="my-5"
    placeholder="Name"

    />

  
        <TextEditor />
        
        </div>
   );
}

export default Prize;