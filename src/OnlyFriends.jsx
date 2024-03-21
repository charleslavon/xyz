const tokenId  = props.tokenId || "v0.8bityonce.near";
if (!tokenId ) return "missing required props";

State.init({
  token: undefined,
  message: "Loading...",
});

const data = fetch("https://graph.mintbase.xyz", {
  method: "POST",
  headers: {
    "mb-api-key": "anon",
    "Content-Type": "application/json",
    "x-hasura-role": "anonymous",
  },
  body: JSON.stringify({
    query: `
query Owners {
  mb_views_nft_tokens(
    where: {
      nft_contract_id: {_eq: "${tokenId}"},
      burned_timestamp: {_is_null: true}
    }
    distinct_on: owner
  ) {
    owner
  }
}
`,
  }),
});

const nftMetadata = Near.view(tokenId, "nft_metadata");

if (!data.ok || !nftMetadata) {
  return "";
}

const owners = data.body.data.mb_views_nft_tokens.map((o) => o.owner);
const isMember = owners.includes(context.accountId);
console.log("owners are ", owners);
console.log("is viewer a member? ", isMember);

if (!isMember) {
  return (
    <div>
      <p>
        You are not allowed to view this content unless you own one of
        <Link href={`https://www.mintbase.xyz/contract/${tokenId}/nfts/all/0`}>
          {" "}
          these tokens.
        </Link>
      </p>
    </div>
  );
}
const p = asyncFetch(
  `https://www.charleslavon.xyz/api/video?videoId=${tokenId}`
);
p.then((res) => {
  const { token } = res.body;
  if (token) {
    State.update({ token });
  } else {
    State.update({ message: "This content is no longer available." });
  }
});

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-tems: center;
`;

const Loader = () => {
  return (
    <LoaderContainer className="loader">
      <span
        className="spinner-grow spinner-grow-sm me-1"
        role="status"
        aria-hidden="true"
      />
      {state.message}
    </LoaderContainer>
  );
};

const Styled = styled.div`
  height: 700px;
`;

return (
  <>
    {!state.token && <Loader />}
    {state.token && (
      <Styled id="styled">
        <iframe
          src={`https://customer-puoqzyr3sphcaxhx.cloudflarestream.com/${state.token}/iframe`}
          iframeResizer
          border="none"
          style={{ height: "100%", width: "100%" }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowfullscreen="true"
        ></iframe>
      </Styled>
    )}
  </>
);
