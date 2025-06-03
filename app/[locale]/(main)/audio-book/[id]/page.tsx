import BookDetail from "../components/book-detail";

interface BookDetailPageProps {
  params: {
    id: string;
  };
}

export default function BookDetailPage({ params }: BookDetailPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <BookDetail bookId={params.id} />
    </div>
  );
}
