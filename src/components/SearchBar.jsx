import { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [input, setInput] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Button clicked! Input is:", input);

        if (input.trim()) {
            onSearch(input);
            setInput("");
        };
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter city..."
            />
            <button type="submit">Search</button>
        </form>
    );
}