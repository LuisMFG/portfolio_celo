import { ProjectForm } from "@/src/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Novo projeto</h1>
      </header>
      <ProjectForm />
    </div>
  );
}
