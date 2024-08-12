import { Typography } from "@material-tailwind/react";

const PointTable = ({ log }) => {
  const TABLE_HEAD = ["일자", "내역", "적립", "사용", "총 마일리지"];

  return (
    <table className="w-full min-w-max table-auto text-center border-2 border-gray-400">
      <thead>
        <tr>
          {TABLE_HEAD.map((head) => (
            <th
              key={head}
              className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal leading-none opacity-70"
              >
                {head}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {log.map(
          ({ transactionDate, description, amount, totalPoint }, index) => {
            const isLast = index === log.length - 1; // 마지막 요소인지 확인
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

            const date = transactionDate.substring(
              0,
              transactionDate.indexOf("T")
            );

            const plusamount = amount > 0 ? amount : null;
            const minusamount = amount < 0 ? Math.abs(amount) : null;

            return (
              <tr key={index}>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {date}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {description}
                  </Typography>
                </td>
                <td className={classes}>
                  {plusamount !== null && (
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {plusamount}
                    </Typography>
                  )}
                </td>
                <td className={classes}>
                  {minusamount !== null && (
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {minusamount}
                    </Typography>
                  )}
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {totalPoint}
                  </Typography>
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
};

export default PointTable;
