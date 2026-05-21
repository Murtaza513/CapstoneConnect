import { useState } from 'react'

function TagsInput({ tags, addTag, removeTags }) {
    console.log('TagsInput 04 => ', tags)
    /*const [tag, setTag] = useState([])*/
    function handleKeyDown(e){
        if(e.key !== 'Enter') return
        const value = e.target.value
        if(!value.trim()) return
        addTag(value)
        /*setTag([...tag, value])*/
        e.target.value = ''
    }

    function removeTag(index) {
        console.log('index 16 => ', index)
        removeTags(index)
        /*setTag(tag?.filter((el, i) => i !== index))*/
    }

    return (
        <div className="tags-input-container">
            {tags?.length ?
                <>
                    {tags?.map((tag, index) => (
                        <div className="tag-item" key={index}>
                            <span className="text">{tag}</span>
                            <span className="close" onClick={() => removeTag(index)}>&times;</span>
                        </div>
                    ))}
                </>:null
            }
            <input onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="Add text and press enter" />
        </div>
    )
}

export default TagsInput