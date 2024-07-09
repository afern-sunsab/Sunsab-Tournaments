import Image from "next/image";

export default function EditThumbnail({ handleThumbnailChange, thumbnail }) {
	return (
		<main className="relative text-[#092C48] pb-16 size-full">
			<input
				id="add-profile-picture"
				type="file"
				accept="image/*"
				onChange={handleThumbnailChange}
				className="block mx-auto mb-4 opacity-0"
			/>
			{(thumbnail != "") ? (
				<label htmlFor="add-profile-picture" className="absolute top-0 left-0 text-center size-full -mt-5">
					<Image
						htmlFor="add-profile-picture"
						src={thumbnail}
						alt="Thumbnail"
						width={200}
						height={200}
						className="block mx-auto border-2 relative border-black m-5 mb-2 hover:cursor-pointer hover:scale-110 transition duration-300"
					/>
				</label>
			) : (
				<label htmlFor="add-profile-picture" className="absolute border-[3px] border-dashed rounded-xl size-full top-0 left-0 flex items-center justify-center">
					<div htmlFor="add-profile-picture" className="size-full hover:cursor-pointer hover:scale-110 transition duration-300 flex items-center justify-center">
						<div htmlFor="add-profile-picture" className="justify-center">
							<h1>Drag and Drop or Click to Upload a Thumbnail</h1>
						</div>
					</div>
				</label>
			)}
		</main>
	);
}