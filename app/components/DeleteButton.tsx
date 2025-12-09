"use client";

import { Trash2 } from "lucide-react";
import { deleteArtwork } from "@/app/actions/artwork";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if(!confirm("Are you sure you want to delete this artwork?")) return;
        
        setIsDeleting(true);
        await deleteArtwork(id);
        setIsDeleting(false);
        router.refresh();
    }

    return (
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 bg-white/10 rounded-full hover:bg-pink hover:text-white transition-colors"
        >
            <Trash2 size={20} />
        </button>
    )
}
