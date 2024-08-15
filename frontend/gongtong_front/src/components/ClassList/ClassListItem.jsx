import CountryFlags from "./../../common/components/CountryFlags";

const FRONT_SERVER_URL = import.meta.env.VITE_FRONT_SERVER;

const ClassListItem = (content) => {
  return (
    <>
      <div className="relative">
        <img
          src={content.content.mainImage}
          alt="클래스 썸네일"
          className="w-full rounded-xl h-44 bg-center"
        />
        <span className="absolute right-1 top-1">
          <CountryFlags
            countryCode={content.content.classCountry.alpha2}
            size={"w-9"}
          />
        </span>
      </div>
      <div className="ClassListItem-TextBox">
        <div className="font-bold text-base mt-2 truncate">
          {content.content.title}
        </div>
        <div className="flex justify-between mt-1 items-center">
          <div className="text-xs flex-none text-slate-500">
            <span className="flex-initial">
              {content.content.startTime.substring(0, 10)}&nbsp;
            </span>
            <span className="flex-initial">
              {content.content.startTime.substring(11, 16)}&nbsp;~&nbsp;
            </span>
            <span className="flex-initial">
              {content.content.endTime.substring(11, 16)}
            </span>
          </div>
          <div className="text-sm flex items-center">
            <span>
              <CountryFlags
                countryCode={content.content.hostCountry.alpha2}
                size={"w-6"}
              />
            </span>
            <span className="text-sm">{content.content.hostName}</span>
          </div>
        </div>
      </div>
    </>
  );
};
export default ClassListItem;
