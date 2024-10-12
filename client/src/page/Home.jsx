import React, { useEffect, useState } from "react";

import { Card, FormField, Loader } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);
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
    if (loading) {
      const interval = setInterval(() => {
        const randomText =
          cuteTexts[Math.floor(Math.random() * cuteTexts.length)];
        setCuteText(randomText);
      }, 5000);

      // Set an initial cute text immediately
      const initialText =
        cuteTexts[Math.floor(Math.random() * cuteTexts.length)];
      setCuteText(initialText);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/post`,
        // "http://localhost:5000/api/v1/post",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto z-0">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[55px]">
          PixelPaws Community
        </h1>
        <p className="mt-2 text-[#666e75] text-[20px] max-w-[500px]">
          Browse through a collection of imaginative and visually stunning
          images generated by AI
        </p>
      </div>

      <div className="mt-16">
        <FormField
          labelName="Search posts"
          type="text"
          name="text"
          placeholder="Search something..."
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center flex-col">
            <Loader />
            <span className="mt-8 text-pink-500 text-[25px] flex ">
              {cuteText}
            </span>
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing Results for{" "}
                <span className="text-[#222328]">{searchText}</span>:
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No Search Results Found"
                />
              ) : (
                <RenderCards data={allPosts} title="No Posts Yet" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
