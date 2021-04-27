import { useMutation, gql } from '@apollo/client';

const UPLOAD_FILE = gql`
	mutation uploadFile($file: FileUpload!) {
		uploadFile(file: $file) {
			url
		}
	}
`;
export default function UploadForm() {
	const [uploadFile] = useMutation(UPLOAD_FILE, {
		onCompleted: (data) => console.log(data),
	});
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		uploadFile({ variables: { file } });
	};
	return (
		<div>
			<h1>Upload file</h1>
			<input type="file" onChange={handleFileChange} />
		</div>
	);
}
