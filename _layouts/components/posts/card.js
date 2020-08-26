import Link from "next/link";
import moment from "moment";
import { truncateString } from "../../../helpers";

export default function Card({ post: { title, slug, meta } }) {
  let { description, date, reading_minutes, image } = meta;

  return (
    <Link href={`/posts/${slug}`}>
      <a title={title} className="w-full md:w-1/2 px-4 pb-12">
        <div className="relative pb-2/4">
          <img src={image} className="absolute h-full w-full object-cover shadow rounded-t-lg" />
        </div>
        <div className="relative px-4 -mt-16">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-baseline">
              <span className="text-gray-500 text-xs uppercase font-medium tracking-wider">
                {moment(date).fromNow()}
                {reading_minutes && ` • ${reading_minutes} Min Read`}
              </span>
            </div>
            <h2 className="my-1 font-medium text-xl text-gray-700 leading-tight truncate">{title}</h2>
            <span className="flex text-gray-600 text-sm">{truncateString(description, 80)}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
