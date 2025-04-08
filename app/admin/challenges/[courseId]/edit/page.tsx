"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Award, Sparkles, ArrowLeft, Plus, Trash } from "lucide-react";
import Link from "next/link";

// Mock data for challenges
const challengesData = [
  {
    id: "1",
    title: "Animal Sounds Quiz",
    instructions: "Listen to the sound and choose the correct animal.",
    type: "multiple-choice",
    lessonId: "1",
    lessonTitle: "Meet the Farm Animals",
    unitTitle: "Farm Animals",
    status: "published",
    createdAt: "2023-06-06T14:00:00Z",
    emoji: "🐮",
    options: [
      { id: "1", text: "Cow", isCorrect: true },
      { id: "2", text: "Sheep", isCorrect: false },
      { id: "3", text: "Chicken", isCorrect: false },
    ],
  },
  {
    id: "2",
    title: "Match Colors with Objects",
    instructions: "Match each color with an object of the same color.",
    type: "matching",
    lessonId: "3",
    lessonTitle: "Primary Colors",
    unitTitle: "Colors and Shapes Fun",
    status: "published",
    createdAt: "2023-06-06T15:30:00Z",
    emoji: "🌈",
    pairs: [
      { id: "1", left: "Red", right: "Apple" },
      { id: "2", left: "Blue", right: "Sky" },
      { id: "3", left: "Yellow", right: "Sun" },
    ],
  },
  {
    id: "3",
    title: "Complete the Sentence",
    instructions:
      "Fill in the missing words to complete the sentences about animals.",
    type: "fill-in-blanks",
    lessonId: "1",
    lessonTitle: "Meet the Farm Animals",
    unitTitle: "Farm Animals",
    status: "published",
    createdAt: "2023-06-07T11:45:00Z",
    emoji: "📝",
    text: "The [blank] says moo. The [blank] says baa.",
    answers: ["cow", "sheep"],
  },
  {
    id: "4",
    title: "Say the Animal Name",
    instructions: "Look at the picture and say the name of the animal.",
    type: "speaking",
    lessonId: "1",
    lessonTitle: "Meet the Farm Animals",
    unitTitle: "Farm Animals",
    status: "draft",
    createdAt: "2023-06-08T16:15:00Z",
    emoji: "🗣️",
  },
  {
    id: "5",
    title: "Listen and Choose",
    instructions: "Listen to the animal sound and choose the correct animal.",
    type: "listening",
    lessonId: "4",
    lessonTitle: "Animal Sounds",
    unitTitle: "Farm Animals",
    status: "published",
    createdAt: "2023-06-09T10:20:00Z",
    emoji: "👂",
  },
];

// Mock data for lessons
const lessons = [
  { id: "1", title: "Meet the Farm Animals", unitTitle: "Farm Animals" },
  { id: "2", title: "Animal Homes", unitTitle: "Farm Animals" },
  { id: "3", title: "Primary Colors", unitTitle: "Colors and Shapes Fun" },
  { id: "4", title: "Animal Sounds", unitTitle: "Farm Animals" },
  { id: "5", title: "Counting to 10", unitTitle: "Numbers and Counting" },
];

const emojis = [
  "🎮",
  "🎯",
  "🎪",
  "🎨",
  "🎭",
  "🎤",
  "🎵",
  "🎹",
  "🎲",
  "🧩",
  "🎪",
  "🎡",
  "🎢",
  "🎠",
  "🎬",
  "📚",
  "📝",
  "✏️",
  "🔍",
  "🧠",
  "👀",
  "👂",
  "👄",
  "🦁",
  "🐯",
  "🐶",
  "🐱",
  "🦊",
  "🐰",
  "🐻",
];

export default function EditChallengePage() {
  const router = useRouter();
  const params = useParams();
  const challengeId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    instructions: "",
    type: "multiple-choice",
    lessonId: "",
    status: "draft",
    emoji: "🎮",
    text: "",
  });

  const [options, setOptions] = useState([
    { id: "1", text: "Option 1", isCorrect: true },
    { id: "2", text: "Option 2", isCorrect: false },
    { id: "3", text: "Option 3", isCorrect: false },
  ]);

  const [pairs, setPairs] = useState([
    { id: "1", left: "Item 1", right: "Match 1" },
    { id: "2", left: "Item 2", right: "Match 2" },
    { id: "3", left: "Item 3", right: "Match 3" },
  ]);

  const [answers, setAnswers] = useState("");

  useEffect(() => {
    // Simulate API fetch
    setIsFetching(true);
    setTimeout(() => {
      const challenge = challengesData.find((c) => c.id === challengeId);
      if (challenge) {
        setFormData({
          title: challenge.title,
          instructions: challenge.instructions,
          type: challenge.type,
          lessonId: challenge.lessonId,
          status: challenge.status,
          emoji: challenge.emoji,
          text: challenge.text || "",
        });

        if (challenge.options) {
          setOptions(challenge.options);
        }

        if (challenge.pairs) {
          setPairs(challenge.pairs);
        }

        if (challenge.answers) {
          setAnswers(challenge.answers.join("\n"));
        }
      }
      setIsFetching(false);
    }, 500);
  }, [challengeId]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addOption = () => {
    const newId = (options.length + 1).toString();
    setOptions([
      ...options,
      { id: newId, text: `Option ${newId}`, isCorrect: false },
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter((option) => option.id !== id));
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const setCorrectOption = (id: string) => {
    setOptions(
      options.map((option) => ({ ...option, isCorrect: option.id === id }))
    );
  };

  const addPair = () => {
    const newId = (pairs.length + 1).toString();
    setPairs([
      ...pairs,
      { id: newId, left: `Item ${newId}`, right: `Match ${newId}` },
    ]);
  };

  const removePair = (id: string) => {
    if (pairs.length <= 2) return;
    setPairs(pairs.filter((pair) => pair.id !== id));
  };

  const updatePair = (id: string, field: "left" | "right", value: string) => {
    setPairs(
      pairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push("/admin/challenges");
    }, 1000);

    console.log(formData);
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-bounce text-5xl">🔄</div>
          <p className="text-xl font-medium text-yellow-600">
            Loading challenge...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="rounded-full hover:bg-yellow-50 hover:text-yellow-600"
        >
          <Link href="/admin/challenges">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to challenges</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
            Edit Challenge 🎮
          </h1>
          <p className="text-gray-600 mt-2">
            Update this fun learning challenge for children
          </p>
        </div>
      </div>

      <Card className="border-none shadow-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500">
          <CardTitle className="text-white flex items-center gap-2">
            <Award className="h-5 w-5" /> Challenge Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700">
                  Challenge Title
                </Label>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Select
                      value={formData.emoji}
                      onValueChange={(value) => handleChange("emoji", value)}
                    >
                      <SelectTrigger className="w-16 h-16 text-3xl flex items-center justify-center p-0 border-2 border-yellow-200 rounded-xl">
                        <SelectValue placeholder="🎮" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 rounded-xl">
                        <div className="grid grid-cols-5 gap-1 p-2">
                          {emojis.map((emoji) => (
                            <SelectItem
                              key={emoji}
                              value={emoji}
                              className="flex items-center justify-center text-2xl cursor-pointer h-10 w-10 rounded-lg hover:bg-yellow-50"
                            >
                              {emoji}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    id="title"
                    placeholder="Enter a fun challenge title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                    className="flex-1 border-2 border-yellow-200 rounded-xl"
                  />
                </div>
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Choose a fun emoji and give your challenge an exciting name!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-700">
                  Challenge Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <SelectTrigger
                    id="type"
                    className="border-2 border-yellow-200 rounded-xl"
                  >
                    <SelectValue placeholder="Select a challenge type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="multiple-choice" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔤</span> Multiple Choice
                      </div>
                    </SelectItem>
                    <SelectItem value="matching" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔄</span> Matching Pairs
                      </div>
                    </SelectItem>
                    <SelectItem value="fill-in-blanks" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📝</span> Fill in the Blanks
                      </div>
                    </SelectItem>
                    <SelectItem value="speaking" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🗣️</span> Speaking Activity
                      </div>
                    </SelectItem>
                    <SelectItem value="listening" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👂</span> Listening Activity
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Choose the type of challenge you want to create!
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-gray-700">
                Instructions for Kids
              </Label>
              <Textarea
                id="instructions"
                placeholder="Write simple, clear instructions that children can understand easily"
                className="min-h-20 border-2 border-yellow-200 rounded-xl"
                value={formData.instructions}
                onChange={(e) => handleChange("instructions", e.target.value)}
                required
              />
              <p className="text-sm text-yellow-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Use simple language that children can understand!
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lessonId" className="text-gray-700">
                  Lesson
                </Label>
                <Select
                  value={formData.lessonId}
                  onValueChange={(value) => handleChange("lessonId", value)}
                >
                  <SelectTrigger
                    id="lessonId"
                    className="border-2 border-yellow-200 rounded-xl"
                  >
                    <SelectValue placeholder="Select a lesson" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {lessons.map((lesson) => (
                      <SelectItem
                        key={lesson.id}
                        value={lesson.id}
                        className="rounded-lg"
                      >
                        {lesson.title} ({lesson.unitTitle})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Choose which lesson this challenge belongs to!
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger
                    id="status"
                    className="border-2 border-yellow-200 rounded-xl"
                  >
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="draft" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✏️</span> Draft - Still
                        working on it
                      </div>
                    </SelectItem>
                    <SelectItem value="published" className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🚀</span> Published - Ready
                        for learning!
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-yellow-600 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Publish when you're ready for students to see it!
                </p>
              </div>
            </div>

            <Card className="border-2 border-yellow-100 rounded-xl shadow-sm">
              <CardContent className="pt-6">
                <Tabs
                  value={formData.type}
                  onValueChange={(value) => handleChange("type", value)}
                >
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-yellow-50 p-1 rounded-xl">
                    <TabsTrigger
                      value="multiple-choice"
                      className="data-[state=active]:bg-white data-[state=active]:text-yellow-600 rounded-lg"
                    >
                      <span className="mr-2">🔤</span> Multiple Choice
                    </TabsTrigger>
                    <TabsTrigger
                      value="matching"
                      className="data-[state=active]:bg-white data-[state=active]:text-yellow-600 rounded-lg"
                    >
                      <span className="mr-2">🔄</span> Matching
                    </TabsTrigger>
                    <TabsTrigger
                      value="fill-in-blanks"
                      className="data-[state=active]:bg-white data-[state=active]:text-yellow-600 rounded-lg"
                    >
                      <span className="mr-2">📝</span> Fill in Blanks
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="multiple-choice">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Question</Label>
                        <Input
                          placeholder="Enter your question here"
                          className="border-2 border-yellow-200 rounded-xl"
                        />
                        <p className="text-sm text-yellow-600 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Make your question clear and simple!
                        </p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-gray-700">Options</Label>
                        <RadioGroup>
                          {options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-2 mb-3"
                            >
                              <RadioGroupItem
                                value={option.id}
                                id={`option-${option.id}`}
                                checked={option.isCorrect}
                                onClick={() => setCorrectOption(option.id)}
                                className="border-2 border-yellow-200 text-yellow-600"
                              />
                              <Input
                                value={option.text}
                                onChange={(e) =>
                                  updateOptionText(option.id, e.target.value)
                                }
                                className="flex-1 border-2 border-yellow-200 rounded-xl"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOption(option.id)}
                                disabled={options.length <= 2}
                                className="rounded-full hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </RadioGroup>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 rounded-xl border-2 border-yellow-200"
                          onClick={addOption}
                        >
                          <Plus className="h-4 w-4" />
                          Add Option
                        </Button>
                        <p className="text-sm text-yellow-600 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Click the correct answer and add as many options as
                          you need!
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="matching">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Matching Pairs</Label>
                        <p className="text-sm text-yellow-600 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Create pairs of items that match together!
                        </p>
                      </div>

                      <div className="space-y-4">
                        {pairs.map((pair) => (
                          <div
                            key={pair.id}
                            className="flex items-center space-x-2 mb-3"
                          >
                            <Input
                              value={pair.left}
                              onChange={(e) =>
                                updatePair(pair.id, "left", e.target.value)
                              }
                              className="flex-1 border-2 border-yellow-200 rounded-xl"
                              placeholder="Item"
                            />
                            <div className="flex-shrink-0 text-yellow-500">
                              →
                            </div>
                            <Input
                              value={pair.right}
                              onChange={(e) =>
                                updatePair(pair.id, "right", e.target.value)
                              }
                              className="flex-1 border-2 border-yellow-200 rounded-xl"
                              placeholder="Match"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removePair(pair.id)}
                              disabled={pairs.length <= 2}
                              className="rounded-full hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 rounded-xl border-2 border-yellow-200"
                          onClick={addPair}
                        >
                          <Plus className="h-4 w-4" />
                          Add Pair
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fill-in-blanks">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">
                          Text with Blanks
                        </Label>
                        <Textarea
                          placeholder="This is a [blank] exercise where you need to fill in the [blank]."
                          className="min-h-32 border-2 border-yellow-200 rounded-xl"
                          value={formData.text}
                          onChange={(e) => handleChange("text", e.target.value)}
                        />
                        <p className="text-sm text-yellow-600 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Use [blank] to show where words are missing!
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray-700">
                          Answers (one per line)
                        </Label>
                        <Textarea
                          className="min-h-20 border-2 border-yellow-200 rounded-xl"
                          placeholder="word1&#10;word2"
                          value={answers}
                          onChange={(e) => setAnswers(e.target.value)}
                        />
                        <p className="text-sm text-yellow-600 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Write each answer on a new line!
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-md px-8 py-6 text-lg"
              >
                {isLoading ? "Saving..." : "Save Changes! 🎮"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/challenges")}
                className="rounded-xl border-2 border-gray-200 px-6 py-6"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
