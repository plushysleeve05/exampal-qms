export default function SidebarWidget() {
  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        Old ExamPal QMS System
      </h3>
      <p className="mb-4 text-gray-500 text-theme-sm dark:text-gray-400">
        Click "Go" to be redirected to the old ExamPal QMS system
      </p>
      <a
        href="https://qma-dashboard.netlify.app/"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-green-500 text-theme-sm hover:bg-green-600"
      >
        Go
      </a>
    </div>
  );
}
