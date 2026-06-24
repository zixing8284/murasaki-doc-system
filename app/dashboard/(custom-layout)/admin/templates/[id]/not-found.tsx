export default function NotFoundTemplate() {
  return (
    <div className="mt-20 flex flex-col items-center">
      <p className="text-xl text-secondary-foreground">404/403</p>
      <p className="text-lg text-muted-foreground">
        模板不存在，或您没有权限编辑它
      </p>
    </div>
  );
}
