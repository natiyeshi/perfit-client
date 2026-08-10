import Users from "./_components/Users";
import CrawlerAuth from "./_components/CrawlerAuth";

const Page = () => {
  return (
    <div className="overflow-y-auto w-full h-full flex-1 flex flex-col">
      <CrawlerAuth />
      <Users />
    </div>
  );
};

export default Page;
