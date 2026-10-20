import Card from "@/components/me/legacy/Card";
import Skeleton from "@/components/Skeleton";
import getPlaceholderString from "@/libs/getPlaceholderString";
import { cn } from "@/libs/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  url:
    | "/docs/personal-data-protection.html"
    | "/docs/privacy-policy.html"
    | "/docs/terms-of-service.html";
};

function Loading() {
  return (
    <div>
      <h1>
        <Skeleton enabled>{getPlaceholderString(8)}</Skeleton>
      </h1>
      <p>
        <Skeleton enabled>{getPlaceholderString(33)}</Skeleton>
      </p>
      <p>
        <Skeleton enabled>{getPlaceholderString(20)}</Skeleton>
      </p>
      <h2>
        <Skeleton enabled>{getPlaceholderString(6)}</Skeleton>
      </h2>
      <p>
        <Skeleton enabled>{getPlaceholderString(7)}</Skeleton>
      </p>
      <p>
        <Skeleton enabled>{getPlaceholderString(12)}</Skeleton>
      </p>
      <p>
        <Skeleton enabled>{getPlaceholderString(10)}</Skeleton>
      </p>
      <p>
        <Skeleton enabled>{getPlaceholderString(11)}</Skeleton>
      </p>
      <ul>
        <li>
          <Skeleton enabled>{getPlaceholderString(9)}</Skeleton>
        </li>
        <li>
          <Skeleton enabled>{getPlaceholderString(11)}</Skeleton>
        </li>
        <li>
          <Skeleton enabled>{getPlaceholderString(9)}</Skeleton>
        </li>
        <li>
          <Skeleton enabled>{getPlaceholderString(11)}</Skeleton>
        </li>
      </ul>
      <h2>
        <Skeleton enabled>{getPlaceholderString(6)}</Skeleton>
      </h2>
      <ol>
        <li>
          <Skeleton enabled>{getPlaceholderString(9)}</Skeleton>
        </li>
        <li>
          <Skeleton enabled>{getPlaceholderString(11)}</Skeleton>
        </li>
        <li>
          <Skeleton enabled>{getPlaceholderString(12)}</Skeleton>
        </li>
        <li>
          <Skeleton enabled>{getPlaceholderString(13)}</Skeleton>
        </li>
      </ol>
    </div>
  );
}

function Doc(props: Props) {
  const { url } = props;
  const { data } = useQuery({
    queryKey: ["doc", url],
    queryFn: async () => {
      const response = await axios.get(url, { responseType: "text" });
      return response.data;
    },
    staleTime: Infinity,
  });

  const content = !data ? (
    <Loading />
  ) : (
    <div dangerouslySetInnerHTML={{ __html: data }} />
  );

  return (
    <div>
      <div
        className={cn(
          "pt-[32px] md:pt-[20px] px-[32px] md:px-[20px]",
          "relative z-1 md:max-w-[1440px] mx-auto mb-[121px]",
        )}
      >
        <Card className="doc">{content}</Card>
      </div>
    </div>
  );
}

export default Doc;
