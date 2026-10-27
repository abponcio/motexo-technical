import bpy
from pathlib import Path
root=str(Path(__file__).resolve().parents[1])+'/'
for obj in bpy.data.objects:
    parent=obj
    while parent and parent.name not in ['SwitchHousing','SwitchRocker']: parent=parent.parent
    if not parent or obj.type!='MESH': continue
    for slot in obj.material_slots:
        if not slot.material or slot.material.name.startswith('MTX smooth switch'): continue
        material=slot.material.copy(); material.name='MTX smooth switch finish'
        for node in list(material.node_tree.nodes):
            if node.label.startswith('MTX generated texture'): material.node_tree.nodes.remove(node)
        slot.material=material
maps={}
for kind in ['mineral','coating','rubber','paper','wood']:
    for channel in ['color','height','roughness']:
        image=bpy.data.images.load(root+'motexo-site/public/assets/textures/'+kind+'-'+channel+'.webp',check_existing=True)
        if channel!='color': image.colorspace_settings.name='Non-Color'
        image.pack()
        maps[(kind,channel)]=image
count=0
for material in bpy.data.materials:
    name=material.name.lower()
    kind='wood' if 'timber' in name else 'paper' if 'carton' in name else 'mineral' if 'concrete' in name or 'mineral' in name else 'rubber' if 'gasket' in name else 'coating' if any(t in name for t in ['powdercoat','enamel','steel','graphite']) else None
    if not kind or not material.use_nodes or 'red' in name: continue
    tree=material.node_tree
    for node in list(tree.nodes):
        if node.label.startswith('MTX generated texture'): tree.nodes.remove(node)
    bsdf=next(n for n in tree.nodes if n.type=='BSDF_PRINCIPLED')
    coord=tree.nodes.new('ShaderNodeTexCoord');coord.label='MTX generated texture coordinates'
    samples={}
    for channel in ['color','height','roughness']:
        node=tree.nodes.new('ShaderNodeTexImage');node.label='MTX generated texture '+channel;node.image=maps[(kind,channel)]
        node.projection='BOX';node.projection_blend=.2
        tree.links.new(coord.outputs['Generated'],node.inputs['Vector']);samples[channel]=node
    bump=tree.nodes.new('ShaderNodeBump');bump.label='MTX generated texture relief';bump.inputs['Strength'].default_value=.22;bump.inputs['Distance'].default_value=.02 if kind=='mineral' else .005
    tree.links.new(samples['height'].outputs['Color'],bump.inputs['Height']);tree.links.new(bump.outputs['Normal'],bsdf.inputs['Normal'])
    tree.links.new(samples['roughness'].outputs['Color'],bsdf.inputs['Roughness'])
    if kind in ['wood','paper']:
        tree.links.new(samples['color'].outputs['Color'],bsdf.inputs['Base Color'])
    else:
        tint=tree.nodes.new('ShaderNodeMixRGB');tint.label='MTX generated texture tint';tint.blend_type='MULTIPLY';tint.inputs[0].default_value=1
        tint.inputs[1].default_value=bsdf.inputs['Base Color'].default_value
        tree.links.new(samples['color'].outputs['Color'],tint.inputs[2]);tree.links.new(tint.outputs[0],bsdf.inputs['Base Color'])
    count+=1
bpy.ops.wm.save_as_mainfile(filepath=root+'motexo-scene/motexo-craft.blend')
print({'textured_materials':count,'packed_maps':len(maps),'saved':bpy.data.filepath})
