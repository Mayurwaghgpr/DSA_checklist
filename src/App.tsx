import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, ExternalLink, Code2, BookOpen, Trophy, Target } from 'lucide-react';
import { categories } from './data';
import './App.css';
type Problem = {
  name: string;
  lc: string;
  gfg: string;
};

type Category = {
  name: string;
  problems: Problem[];
};

function App() {
  const [progress, setProgress] = useState<Record<string, boolean[]>>({});
  useEffect(() => {
    const savedProgress = localStorage.getItem('dsaProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress) as Record<string, boolean[]>);
    }
  }, []);
  const handleCheckboxChange = (categoryName: string, problemIndex: number) => {
    const categoryProgress = progress[categoryName] || [];
    const newCategoryProgress = [...categoryProgress];
    newCategoryProgress[problemIndex] = !newCategoryProgress[problemIndex];
    const newProgress= { ...progress, [categoryName]: newCategoryProgress };
    setProgress(newProgress);
    localStorage.setItem('dsaProgress', JSON.stringify(newProgress));
  };
  const getCompletionStats = () => {
    let totalProblems = 0;
    let completedProblems = 0;
    
    categories.forEach(category => {
      totalProblems += category.problems.length;
      const categoryProgress = progress[category.name] || [];
      completedProblems += categoryProgress.filter(Boolean).length;
    });
    
    return { totalProblems, completedProblems, percentage: Math.round((completedProblems / totalProblems) * 100) || 0 };
  };

  const getCategoryProgress = (categoryName: string) => {
    const categoryProgress = progress[categoryName] || [];
    const completed = categoryProgress.filter(Boolean).length;
    const total = categories.find(c => c.name === categoryName)?.problems.length || 0;
    return { completed, total, percentage: Math.round((completed / total) * 100) || 0 };
  };

  const stats = getCompletionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code2 className="w-8 h-8 text-purple-400" />
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
          {categories.map((category: Category) => {
            const categoryStats = getCategoryProgress(category.name);
            return (
              <div key={category.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">{category.name}</h2>
                    <p className="text-slate-300">{category.problems.length} problems</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{categoryStats.percentage}%</div>
                    <div className="text-sm text-slate-300">{categoryStats.completed}/{categoryStats.total}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${categoryStats.percentage}%` }}
                  ></div>
                </div>

                {/* Problems List */}
                <div className="space-y-3">
                  {category.problems.map((problem: Problem, index: number) => {
                    const isCompleted = (progress[category.name] || [])[index] || false;
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
                          onClick={() => handleCheckboxChange(category.name, index)}
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
                        </div>
                      </div>
                    );
                  })}
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