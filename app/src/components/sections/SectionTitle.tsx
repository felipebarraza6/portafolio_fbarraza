type Props = {
  comment: string;
};

/** Solo el comentario `// …`: los títulos blancos e índices pixel no aportan. */
export default function SectionTitle({ comment }: Props) {
  return (
    <div className="mb-5">
      <p className="section-comment !mb-0">{comment}</p>
    </div>
  );
}
