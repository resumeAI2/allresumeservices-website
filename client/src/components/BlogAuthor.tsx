import { Card } from "@/components/ui/card";

interface BlogAuthorProps {
  name: string;
  title: string;
  bio: string;
  photo: string;
  expertise: string[];
}

export function BlogAuthor({ name, title, bio, photo, expertise }: BlogAuthorProps) {
  return (
    <Card className="p-6 bg-card">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Author Photo */}
        <div className="flex-shrink-0">
          <img
            src={photo}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
          />
        </div>

        {/* Author Info */}
        <div className="flex-1">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-foreground">{name}</h3>
            <p className="text-sm text-primary font-medium">{title}</p>
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {bio}
          </p>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2">
            {expertise.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
