import Link from "next/link";
import moment from "moment";
import { truncateString } from "../../../helpers";
import Image from "next/image";

export default function Card({ post: { title, slug, meta } }) {
  let { description, date, reading_minutes, image, image_height, image_width } = meta;

  return (
    <Link href={`/posts/${slug}`}>
      <a title={title} className="w-full px-2 pb-12 md:w-1/2">
        <div className="relative pb-2/4 dark-mode:opacity-75">
          <Image src={image} alt={meta.seo_title} className="rounded-lg shadow" layout="fill" objectFit="cover" priority="true" />
        </div>
        <div className="relative px-4 -mt-16">
          <div className="p-6 bg-white rounded-lg shadow dark-mode:bg-gray-800">
            <div className="flex items-baseline">
              <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                {moment(date).fromNow()}
                {reading_minutes && ` • ${reading_minutes} Min Read`}
              </span>
            </div>
            <h2 className="my-1 text-xl font-medium leading-tight text-gray-700 truncate dark-mode:text-gray-300">{title}</h2>
            <span className="flex text-sm text-gray-600 dark-mode:text-gray-500">{truncateString(description, 80)}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
