import React, { useRef, useEffect, useState } from 'react';

const MultiSelect = ({ jury, selectedJury, setSelectedJury, setEvalErr }) => {
    
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionChange = (name) => {
        setEvalErr(null)
            setSelectedJury(prevSelected =>
                prevSelected?.includes(name)
                    ? prevSelected.filter(item => item !== name)
                    : [...prevSelected, name]
        );

        /*setSelectedJury(selectedJury?.includes(name)
            ? selectedJury?.filter(item => item !== name)
            : [...selectedJury, name])*/

    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div style={{ paddingBottom: "8px", position: 'relative' }}>
            <label>Jury</label>
            <div
                className="form-control custom-select"
                onClick={handleToggleDropdown}
                style={{ marginRight: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <span>{selectedJury?.length > 0 ? selectedJury?.map(name => jury?.find(item => item.username === name)?.username).join(', ') : 'Select Jury'}</span>
                <span>&#9660;</span>
            </div>
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        width: '100%',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}
                >
                    {jury?.map((item, index) => (
                        <div key={index} style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                id={index}
                                checked={selectedJury?.includes(item.username)}
                                onChange={() => handleOptionChange(item.username)}
                                disabled={selectedJury?.length >= 3 && !selectedJury?.includes(item.username)}
                                style={{ transform: 'scale(1.5)', marginRight: '10px' }}
                            />
                            <label htmlFor={index} style={{ margin: 0 }}>
                                {item.username}
                            </label>
                        </div>
                    ))}
                    <div style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            id="jury-other"
                            checked={selectedJury?.includes('Other')}
                            onChange={() => handleOptionChange('Other')}
                            style={{ transform: 'scale(1.5)', marginRight: '10px' }}
                        />
                        <label htmlFor="jury-other" style={{ margin: 0 }}>
                            Other
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
