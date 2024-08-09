// "w-숫자"로 보내야함! 숫자만 썼을 경우 일부 숫자만 반영되는 문제가 있어서 w-8 이렇게 써야합니다.
const CountryFlags = ({ countryCode, countryName, size }) => {
  const countrySVGLists = {
    KR: (
      <img
        src="/images/countries/KR.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    US: (
      <img
        src="/images/countries/US.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    CN: (
      <img
        src="/images/countries/CN.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    JP: (
      <img
        src="/images/countries/JP.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    ES: (
      <img
        src="/images/countries/ES.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    FR: (
      <img
        src="/images/countries/FR.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    DE: (
      <img
        src="/images/countries/DE.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    RU: (
      <img
        src="/images/countries/RU.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    IT: (
      <img
        src="/images/countries/IT.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    PT: (
      <img
        src="/images/countries/PT.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    SA: (
      <img
        src="/images/countries/SA.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    IN: (
      <img
        src="/images/countries/IN.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    VN: (
      <img
        src="/images/countries/VN.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    TH: (
      <img
        src="/images/countries/TH.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
    TR: (
      <img
        src="/images/countries/TR.svg"
        alt={countryName}
        className={`border border-solid ${size}`}
      />
    ),
  };

  return (
    <div className="text-3xl font-extrabold flex items-baseline gap-x-2 ">
      <p>{countryName}</p>
      <p className="self-end">{countrySVGLists[countryCode]}</p>
    </div>
  );
};
export default CountryFlags;
