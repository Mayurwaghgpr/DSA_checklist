import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, BookOpen, Trophy, Target, Book, Lightbulb } from 'lucide-react';
import Check from '/check.svg';
import { categories } from './data';

type Problem = {
  name: string;
  lc?: string;
  gfg?: string;
  yt?: string;
};

type Resource = {
  name: string;
  link: string;
};

type Difficulties = {
  easy: Problem[];
  medium: Problem[];
  hard: Problem[];
};

type Category = {
  name: string;
  difficulties: Difficulties;
  logicTips: string;
  resources: Resource[];
};

type Progress = Record<string, { easy: boolean[]; medium: boolean[]; hard: boolean[] }>;

function App() {
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    const savedProgress = localStorage.getItem('dsaProgress');
    if (savedProgress) {
      let loadedProgress: any = JSON.parse(savedProgress);

      // Migration logic for old format
      const firstKey = Object.keys(loadedProgress)[0];
      if (firstKey && Array.isArray(loadedProgress[firstKey])) {
        // Old format: migrate to new structure
        const migrated: Progress = {};
        categories.forEach((cat) => {
          const oldProg = loadedProgress[cat.name] || [];
          let idx = 0;
          const newCat: { easy: boolean[]; medium: boolean[]; hard: boolean[] } = {
            easy: [],
            medium: [],
            hard: [],
          };
          ['easy', 'medium', 'hard'].forEach((diff) => {
            const probs = cat.difficulties[diff as keyof Difficulties];
            newCat[diff as keyof Difficulties] = oldProg.slice(idx, idx + probs.length);
            idx += probs.length;
          });
          migrated[cat.name] = newCat;
        });
        loadedProgress = migrated;
        localStorage.setItem('dsaProgress', JSON.stringify(loadedProgress));
      }

      setProgress(loadedProgress as Progress);
    }
  }, []);

  const handleCheckboxChange = (categoryName: string, difficulty: keyof Difficulties, problemIndex: number) => {
    setProgress((prev) => {
      const categoryProgress = prev[categoryName] || { easy: [], medium: [], hard: [] };
      const diffProgress = categoryProgress[difficulty] || [];
      const newDiffProgress = [...diffProgress];
      newDiffProgress[problemIndex] = !newDiffProgress[problemIndex];
      const newCategoryProgress = { ...categoryProgress, [difficulty]: newDiffProgress };
      const newProgress = { ...prev, [categoryName]: newCategoryProgress };
      localStorage.setItem('dsaProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const getCompletionStats = () => {
    let totalProblems = 0;
    let completedProblems = 0;

    categories.forEach((category) => {
      Object.values(category.difficulties).forEach((probs) => {
        totalProblems += probs.length;
      });
      const categoryProgress = progress[category.name] || { easy: [], medium: [], hard: [] };
      Object.values(categoryProgress).forEach((diffProgress) => {
        if (Array.isArray(diffProgress)) {
          completedProblems += diffProgress.filter(Boolean).length;
        }
      });
    });

    return {
      totalProblems,
      completedProblems,
      percentage: Math.round((completedProblems / totalProblems) * 100) || 0,
    };
  };

  const getCategoryProgress = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    if (!category) return { completed: 0, total: 0, percentage: 0 };

    let total = 0;
    let completed = 0;
    Object.values(category.difficulties).forEach((probs) => {
      total += probs.length;
    });
    const categoryProgress = progress[categoryName] || { easy: [], medium: [], hard: [] };
    Object.values(categoryProgress).forEach((diffProgress) => {
      if (Array.isArray(diffProgress)) {
        completed += diffProgress.filter(Boolean).length;
      }
    });

    return { completed, total, percentage: Math.round((completed / total) * 100) || 0 };
  };

  const getDifficultyProgress = (categoryName: string, difficulty: keyof Difficulties) => {
    const categoryProgress = progress[categoryName] || { easy: [], medium: [], hard: [] };
    const diffProgress = categoryProgress[difficulty] || [];
    const total = categories.find((c) => c.name === categoryName)?.difficulties[difficulty].length || 0;
    const completed = Array.isArray(diffProgress) ? diffProgress.filter(Boolean).length : 0;
    return { completed, total, percentage: Math.round((completed / total) * 100) || 0 };
  };

  const stats = getCompletionStats();

  const difficultiesOrder: (keyof Difficulties)[] = ['easy', 'medium', 'hard'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={Check} alt="App Logo" className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              DSA Practice Checklist
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Track your Data Structures & Algorithms practice journey. Master the fundamentals and ace your coding interviews.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h3 className="text-white font-semibold">Progress</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-2">{stats.percentage}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-semibold">Completed</h3>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.completedProblems}</div>
            <div className="text-slate-300">out of {stats.totalProblems} problems</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-semibold">Categories</h3>
            </div>
            <div className="text-3xl font-bold text-blue-400">{categories.length}</div>
            <div className="text-slate-300">topic areas</div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories.map((category) => {
            const categoryStats = getCategoryProgress(category.name);
            return (
              <div key={category.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{category.name}</h2>
                    <p className="text-slate-300">{categoryStats.total} problems</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{categoryStats.percentage}%</div>
                    <div className="text-sm text-slate-300">{categoryStats.completed}/{categoryStats.total}</div>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${categoryStats.percentage}%` }}
                  ></div>
                </div>

                {/* Difficulties Sections */}
                {difficultiesOrder.map((diff) => {
                  const diffProbs = category.difficulties[diff];
                  const diffStats = getDifficultyProgress(category.name, diff);
                  if (diffProbs.length === 0) return null;
                  return (
                    <div key={diff} className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white capitalize">{diff}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-400">{diffStats.percentage}%</div>
                          <div className="text-sm text-slate-300">{diffStats.completed}/{diffStats.total}</div>
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1 mb-4">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-500"
                          style={{ width: `${diffStats.percentage}%` }}
                        ></div>
                      </div>
                      <div className="space-y-3">
                        {diffProbs.map((problem, index) => {
                          const isCompleted = (progress[category.name]?.[diff]?.[index] || false);
                          return (
                            <div 
                              key={index}
                              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                                isCompleted 
                                  ? 'bg-green-500/20 border-green-400/50 text-green-100' 
                                  : 'bg-white/5 border-white/10 text-white hover:border-purple-400/50 hover:bg-white/10'
                              }`}
                            >
                              <button
                                onClick={() => handleCheckboxChange(category.name, diff, index)}
                                className="flex-shrink-0 transition-all duration-200 hover:scale-110"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                                ) : (
                                  <Circle className="w-6 h-6 text-slate-400 hover:text-purple-400" />
                                )}
                              </button>
                              
                              <div className="flex-grow">
                                <span className={`font-medium ${isCompleted ? 'line-through text-green-200' : ''}`}>
                                  {problem.name}
                                </span>
                              </div>
                              
                              <div className="flex gap-2">
                                {problem.lc && (
                                  <a 
                                    href={problem.lc} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-3 py-1 bg-orange-500/20 text-orange-300 rounded-lg hover:bg-orange-500/30 transition-all duration-200 text-sm font-medium"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    LC
                                  </a>
                                )}
                                {problem.gfg && (
                                  <a 
                                    href={problem.gfg} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-200 text-sm font-medium"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    GFG
                                  </a>
                                )}
                                {problem.yt && (
                                  <a 
                                    href={problem.yt} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-200 text-sm font-medium"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    YT
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Logic Tips */}
                <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-blue-300" />
                    <h4 className="text-white font-semibold">Logic Tips</h4>
                  </div>
                  <p className="text-slate-200">{category.logicTips}</p>
                </div>

                {/* Resources */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Book className="w-5 h-5 text-indigo-300" />
                    <h4 className="text-white font-semibold">Resources</h4>
                  </div>
                  <div className="space-y-2">
                    {category.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-indigo-500/20 rounded-lg hover:bg-indigo-500/30 transition-all duration-200 text-indigo-200"
                      >
                        {resource.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-slate-400">
          <p>Keep coding, keep improving! 🚀</p>
        </div>
      </div>
    </div>
  );
}

export default App;