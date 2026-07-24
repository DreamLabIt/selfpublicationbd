interface Props {
  description: string;
}

export default function Description({
  description,
}: Props) {
  if (!description) return null;

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{
        __html: description,
      }}
    />
  );
}