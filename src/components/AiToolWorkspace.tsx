import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Download, Loader2, RotateCcw, Sparkle } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { generateAssistantOutput } from "@/lib/ai.functions";

export type ToolField = {
  name: string;
  label: string;
  type: "input" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  required?: boolean;
  rows?: number;
  hint?: string;
};

export type ToolConfig = {
  system: string;
  fields: ToolField[];
  buildPrompt: (values: Record<string, string>) => string;
  submitLabel: string;
  outputLabel: string;
  fileName: string;
};

export function AiToolWorkspace({ config }: { config: ToolConfig }) {
  const generate = useServerFn(generateAssistantOutput);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      config.fields.map((f) => [f.name, f.type === "select" ? (f.options?.[0] ?? "") : ""]),
    ),
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const setValue = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  async function run() {
    const missing = config.fields.filter((f) => f.required && !values[f.name]?.trim());
    if (missing.length) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const result = await generate({
        data: { system: config.system, prompt: config.buildPrompt(values) },
      });
      setOutput(result.text.trim());
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error && error.message.includes("402")
          ? "AI credits are exhausted for this workspace."
          : "Couldn't generate that. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    void navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }

  function download() {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = config.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card className="h-fit shadow-panel">
        <CardHeader>
          <CardTitle className="text-base">Structured prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <Label htmlFor={field.name} className="text-xs font-medium">
                {field.label}
                {field.required ? <span className="text-destructive"> *</span> : null}
              </Label>

              {field.type === "input" ? (
                <Input
                  id={field.name}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
              ) : null}

              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  rows={field.rows ?? 5}
                  value={values[field.name] ?? ""}
                  placeholder={field.placeholder}
                  onChange={(e) => setValue(field.name, e.target.value)}
                />
              ) : null}

              {field.type === "select" ? (
                <Select
                  value={values[field.name] ?? ""}
                  onValueChange={(v) => setValue(field.name, v)}
                >
                  <SelectTrigger id={field.name}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}

              {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
            </div>
          ))}

          <Button onClick={run} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkle className="size-4" />
            )}
            {loading ? "Generating…" : config.submitLabel}
          </Button>

          <AiDisclaimer />
        </CardContent>
      </Card>

      <Card className="shadow-panel">
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <CardTitle className="truncate text-base">{config.outputLabel}</CardTitle>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button variant="outline" size="icon-sm" onClick={copy} disabled={!output} title="Copy">
              <Copy className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={download}
              disabled={!output}
              title="Download"
            >
              <Download className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={run}
              disabled={loading}
              title="Regenerate"
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {output || loading ? (
            <Tabs defaultValue="edit">
              <TabsList className="mb-3">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  rows={18}
                  placeholder={loading ? "Drafting…" : ""}
                  className="font-sans text-sm leading-relaxed"
                />
              </TabsContent>
              <TabsContent value="preview">
                <div className="prose prose-sm max-w-none rounded-lg border border-border bg-muted/40 p-4 dark:prose-invert">
                  <ReactMarkdown>{output || "_Nothing yet._"}</ReactMarkdown>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="grid min-h-[280px] place-items-center rounded-lg border border-dashed border-border text-center">
              <div className="max-w-xs px-6">
                <Sparkle className="mx-auto size-6 text-primary" />
                <p className="mt-3 text-sm font-medium">Your editable draft appears here</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Fill in the prompt fields, generate, then refine the text directly.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
