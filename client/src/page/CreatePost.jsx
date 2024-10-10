import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cuteText, setCuteText] = useState("");

  const cuteTexts = [
    "Good things take time",
    "Patience is a virtue",
    "Hang tight, magic is happening",
    "Great things are worth waiting for",
    "Almost there, stay tuned",
    "The best is yet to come",
    "It's worth the wait (mostly)",
    "Cute things take time",
  ];

  useEffect(() => {
    if (generatingImg) {
      const interval = setInterval(() => {
        const randomText =
          cuteTexts[Math.floor(Math.random() * cuteTexts.length)];
        setCuteText(randomText);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [generatingImg]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      console.log("Generating image...");
      console.log(JSON.stringify(form.prompt));
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "https://pixelpaws-wp-project.onrender.com/api/v1/dalle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: form.prompt,
            }),
          }
        );

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
        toast.success("Image generated successfully");
      } catch (err) {
        toast.error("Failed to generate image");
      } finally {
        setGeneratingImg(false);
      }
    } else {
      toast.error("Please enter a prompt to generate an image");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://pixelpaws-wp-project.onrender.com/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...form }),
          }
        );

        await response.json();
        toast.success("Shared with the community successfully");
        navigate("/");
      } catch (err) {
        toast.error("Failed to share with the community");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please generate an image with proper details");
    }
  };

  return (
    <section className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg font-poppins">
      <div>
        <h1 className="font-extrabold text-pink-600 text-[32px]">Create</h1>
        <p className="mt-2 text-pink-500 text-[14px] max-w-[500px]">
          Generate an imaginative image through AI and share it with the
          community
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-pink-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 w-64 p-3 h-64 flex justify-center items-center shadow-md">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="150"
                height="150"
                viewBox="0 0 24 24"
                fill="none"
                stroke="gray"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-image">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
          {generatingImg && (
            <span className="mt-2 text-pink-500 text-[16px] flex ">
              {cuteText}
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-pink-600 hover:bg-pink-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors duration-300">
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-pink-500 text-[16px]">
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-pink-600 hover:bg-pink-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-colors duration-300">
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
