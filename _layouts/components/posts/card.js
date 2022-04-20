import Link from "next/link";
import moment from "moment";
import { truncateString } from "../../../helpers";
import Image from "next/image";

export default function Card({ post: { title, slug, meta } }) {
  let { description, date, reading_minutes, image, image_height, image_width } = meta;

  return (
    <Link href={`/posts/${slug}`}>
      <a title={title} className="flex flex-col rounded-lg shadow-lg overflow-hidden relative">
        <div className="flex-shrink-0 overflow-hidden" style={{ maxHeight: 240 + "px" }}>
          <Image
            src={image}
            alt={meta.seo_title}
            width={image_width}
            height={image_height}
            className="overflow-hidden h-48 w-full object-fill"
            priority="true"
          />
        </div>
        <div className="flex-1 bg-white dark:bg-slate-800 p-6 flex flex-col justify-between">
          <div className="flex-1">
            <p className="text-xl font-semibold text-slate-900 dark:text-slate-200">{title}</p>
            <p className="mt-3 text-base text-slate-500 dark:text-slate-400">{truncateString(description, 300)}</p>
          </div>
          <div className="mt-6 flex items-center">
            <div className="flex space-x-1 text-sm text-slate-500 ">
              <time dateTime={date}>{moment(date).fromNow()}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{reading_minutes} mins read</span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
