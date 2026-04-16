import { ExperienceForm } from "@/src/components/admin/experience-form";

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Nova experiência</h1>
      </header>
      <ExperienceForm />
    </div>
  );
}
