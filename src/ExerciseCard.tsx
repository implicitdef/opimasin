/** A bordered card whose tinted top strip acts as the heading of its body. */
function ExerciseCard({
  heading,
  children,
}: {
  heading: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-600">
      <div className="bg-blue-100 border-b border-gray-600 px-5 py-3">
        {heading}
      </div>
      <div className="px-5 py-6">{children}</div>
    </div>
  );
}

export default ExerciseCard;
