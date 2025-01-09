import "../App.css";

export default function UploadPage() {
  async function submitPapers() {
    const token = localStorage.getItem("jwtToken");

    try {
      const response = await fetch(
        "http://localhost:3000/api/adminRequest/parseRequest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: "hello",
        }
      );
      // if (response.ok) {
      //   const result = await response.json();
      //   setPapers(result as PaperData[]);
      // } else {
      //   console.error(`Failed to fetch papers: ${response.status}`);
      // }
    } catch (error) {
      console.error(`Error fetching papers: ${error}`);
      throw error;
    }
  }

  return (
    <div>
      <div>Upload Page</div>
      <button className="bg-usask-green text-[#DADADA]" onClick={submitPapers}>
        Upload
      </button>
    </div>
  );
}
