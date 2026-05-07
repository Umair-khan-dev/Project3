export default function MessageBubble({ msg, own }) {
    return (
        <div className={`flex mb-2 ${own ? "justify-end" : "justify-start"}`}>
            <div className={`relative px-3 py-1.5 rounded-xl max-w-[75%] shadow-sm text-[14.5px]
            ${own
                    ? "bg-[#005c4b] text-[#e9edef] rounded-tr-none"
                    : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                }`}
            >
                <div className="pr-12 pb-1 leading-tight break-words">
                    {msg.message}
                </div>
                <div className="absolute bottom-1 right-2 flex items-center gap-1">
                    <span className="text-[10px] text-gray-400">
                        {msg.time}
                    </span>
                    {own && (
                        <span className="text-blue-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M11.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L5 12.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}