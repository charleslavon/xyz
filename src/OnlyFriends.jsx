const { videoId, cdnAccount } = props;
if (!videoId || !cdnAccount) return "missing required props";

State.init({
  token: undefined,
  message: "Loading...",
});

const p = asyncFetch(
  `https://www.charleslavon.xyz/api/video?videoId=${videoId}`
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
  width: ${width};
  height: ${height};
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


return (
  <>
    {!state.token && <Loader />}
    {state.token && (
        <iframe
          src={`https://customer-${cdnAccount}.cloudflarestream.com/${state.token}/iframe`}
          iframeResizer
          height="720"
          width="1280"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowfullscreen="true"
        ></iframe>
    )}
  </>
);
