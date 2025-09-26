import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useGameState } from '@/components/GameHUD';
import skillsData from '@/data/skills.json';

interface SkillNode {
  id: string;
  type: 'root' | 'domain' | 'skill';
  level?: number;
  tags?: string[];
  x?: number;
  y?: number;
  description?: string;
  projects?: string[];
}

interface SkillLink {
  source: string;
  target: string;
}

interface SelectedSkill {
  id: string;
  type: string;
  level?: number;
  description?: string;
  projects?: string[];
  tags?: string[];
}

export const SkillTreeGraph = () => {
  const graphRef = useRef<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<SelectedSkill | null>(null);
  const [clickedSkills, setClickedSkills] = useState<Set<string>>(new Set());
  const { trackCriticalAction } = useGameState();

  const handleNodeClick = useCallback((node: any) => {
    if (node.type === 'skill') {
      setSelectedSkill({
        id: node.id,
        type: node.type,
        level: node.level,
        description: node.description,
        projects: node.projects,
        tags: node.tags
      });
      
      // Track clicked skills for XP
      const newClickedSkills = new Set(clickedSkills);
      if (!newClickedSkills.has(node.id)) {
        newClickedSkills.add(node.id);
        setClickedSkills(newClickedSkills);
        
        if (newClickedSkills.size === 5) {
          trackCriticalAction('Skill Explorer Achievement');
        }
      }
    }
  }, [clickedSkills, trackCriticalAction]);

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.id;
    const fontSize = node.type === 'root' ? 16 : node.type === 'domain' ? 14 : 12;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Node styling based on type
    let nodeColor = '#64748b';
    let glowColor = '#64748b';
    let nodeSize = 8;

    if (node.type === 'root') {
      nodeColor = '#00ffff';
      glowColor = '#00ffff';
      nodeSize = 12;
    } else if (node.type === 'domain') {
      nodeColor = '#a855f7';
      glowColor = '#a855f7';
      nodeSize = 10;
    } else if (node.type === 'skill') {
      nodeColor = '#10b981';
      glowColor = '#10b981';
      nodeSize = 6 + (node.level || 0) / 10;
    }

    // Draw glow effect
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize + 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = glowColor + '20';
    ctx.fill();

    // Draw main node
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor;
    ctx.fill();

    // Draw border
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
    ctx.strokeStyle = nodeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw label
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, node.x, node.y + nodeSize + 15);

    // Draw level indicator for skills
    if (node.type === 'skill' && node.level) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`Lv.${node.level}`, node.x, node.y + nodeSize + 28);
    }
  }, []);

  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const { source, target } = link;
    
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);

  const zoomToFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(1000, 50);
    }
  };

  const zoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.5, 1000);
    }
  };

  const zoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 0.75, 1000);
    }
  };

  useEffect(() => {
    if (graphRef.current) {
      // Auto-fit the graph after initial render
      setTimeout(() => {
        zoomToFit();
      }, 100);
    }
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-background-secondary rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="sm" onClick={zoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomToFit}>
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Skill Grid - Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {skillsData.nodes.filter(node => node.type === 'skill').map((skill) => (
          <Card 
            key={skill.id} 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 neon-glow-cyan"
            onClick={() => handleNodeClick(skill)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg gradient-text-primary">{skill.id}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Lv.{skill.level}</Badge>
                <div className="text-sm text-muted-foreground">
                  {skill.tags?.join(', ')}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={skill.level} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">{skill.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skill Details Drawer */}
      {selectedSkill && (
        <div className="absolute inset-y-0 right-0 w-80 bg-background border-l border-border p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold gradient-text-primary">{selectedSkill.id}</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedSkill(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {selectedSkill.level && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Proficiency</span>
                <span className="text-sm font-medium">{selectedSkill.level}%</span>
              </div>
              <Progress value={selectedSkill.level} className="h-2" />
            </div>
          )}

          {selectedSkill.description && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{selectedSkill.description}</p>
            </div>
          )}

          {selectedSkill.tags && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Categories</h4>
              <div className="flex flex-wrap gap-1">
                {selectedSkill.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {selectedSkill.projects && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Projects</h4>
              <ul className="space-y-1">
                {selectedSkill.projects.map((project, index) => (
                  <li key={index} className="text-sm text-muted-foreground">• {project}</li>
                ))}
              </ul>
            </div>
          )}

          <Button className="w-full" variant="outline">
            View Related Blog Posts
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border">
        <h4 className="text-sm font-medium mb-2">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Root</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span>Domain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span>Skill (size = proficiency)</span>
          </div>
        </div>
      </div>
    </div>
  );
};