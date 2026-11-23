// Maps a Django API project payload to the shape consumed by
// PremiumProjectCard / project detail views. Prices always come
// from the backend — nothing is invented client-side.
export function projectToCard(project) {
  return {
    id: project.id,
    slug: project.slug,
    number: project.id,
    title: project.title,
    name: project.title,
    category: project.category?.name || 'General',
    categorySlug: project.category?.slug || '',
    difficulty: (project.difficulty_level || 'intermediate').replace(/^\w/, (c) => c.toUpperCase()),
    shortDescription: project.short_description || '',
    description: project.description || project.short_description || '',
    overview: project.description || '',
    problemStatement: project.problem_statement || '',
    keyFeatures: project.key_features || [],
    technologies: [
      ...(project.programming_languages || []),
      ...(project.technologies || []),
      ...(project.frameworks || []),
      ...(project.database_technologies || []),
      ...(project.tools_used || []),
    ].filter(Boolean),
    price: project.price,
    compareAtPrice: project.compare_at_price,
    discountPercentage: project.discount_percentage || 0,
    primaryImage: project.primary_image,
    images: project.images || [],
    projectType: project.project_type,
    requirements: project.requirements || [],
    installationInstructions: project.installation_instructions || '',
    documentationDescription: project.documentation_description || '',
    architectureDescription: project.architecture_description || '',
    liveDemoUrl: project.live_demo_url || '',
    demoVideoUrl: project.demo_video_url || '',
    accentColor: '#34e0a1',
    _api: project,
  }
}
