"""Motexo authored scene assets, executed in the user's Blender through MCP. No external assets."""
import bpy, math, json
from mathutils import Vector
from pathlib import Path
OUT = str(Path(__file__).resolve().parents[1])
assert bpy.data.objects.get('Motexo_Craft') is None, 'Inspect existing authored work before running again'
scene = bpy.data.scenes.new('Motexo_Craft_Studio')
bpy.context.window.scene = scene
scene.render.threads_mode = 'FIXED'; scene.render.threads = 1
root = bpy.data.objects.new('Motexo_Craft', None); scene.collection.objects.link(root)
meshes=[]
def material(name, color, metal=0, rough=.5):
 m=bpy.data.materials.new(name); m.use_nodes=True
 node=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
 node.inputs['Base Color'].default_value=(*color,1); node.inputs['Metallic'].default_value=metal; node.inputs['Roughness'].default_value=rough
 m.diffuse_color=(*color,1); return m
m={
 'graphite':material('MTX graphite powdercoat',(.022,.027,.03),0,.34),
 'edge':material('MTX machined edge',(.12,.14,.15),1,.25),
 'red':material('MTX signal red enamel',(.58,.004,.005),0,.25),
 'gasket':material('MTX black gasket',(.006,.008,.009),0,.87),
 'steel':material('MTX galvanized steel',(.42,.47,.49),1,.38),
 'white':material('MTX warm white polymer',(.74,.75,.71),0,.47),
 'floor':material('MTX polished concrete',(.21,.23,.23),0,.56),
 'wall':material('MTX mineral wall',(.52,.55,.54),0,.86),
 'wood':material('MTX pallet timber',(.24,.14,.068),0,.89),
 'carton':material('MTX kraft carton',(.43,.30,.16),0,.94),
 'carton2':material('MTX pale carton',(.61,.48,.31),0,.9),
 'tape':material('MTX packing tape',(.65,.53,.34),0,.35),
 'paint':material('MTX aisle paint',(.88,.67,.18),0,.7),
 'rack':material('MTX racking graphite',(.055,.079,.09),.65,.43),
 'lamp':material('MTX luminaire',(.94,.92,.81),0,.3),
}
lamp=next(n for n in m['lamp'].node_tree.nodes if n.type=='BSDF_PRINCIPLED'); lamp.inputs['Emission Color'].default_value=(1,.93,.8,1); lamp.inputs['Emission Strength'].default_value=2

def group(name,p=(0,0,0),parent=root):
 obj=bpy.data.objects.new(name,None);scene.collection.objects.link(obj);obj.parent=parent;obj.location=(p[0],-p[2],p[1]);return obj

def block(name,p,size,mat,parent,bevel=0):
 x,y,z=size[0]/2,size[2]/2,size[1]/2
 verts=[(-x,-y,-z),(x,-y,-z),(x,y,-z),(-x,y,-z),(-x,-y,z),(x,-y,z),(x,y,z),(-x,y,z)]
 data=bpy.data.meshes.new(name);data.from_pydata(verts,[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);data.materials.append(mat)
 for poly in data.polygons: poly.use_smooth=True
 obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.parent=parent;obj.location=(p[0],-p[2],p[1]);meshes.append(obj)
 if bevel:
  mod=obj.modifiers.new('Manufactured edge','BEVEL');mod.width=bevel;mod.segments=3 if parent.name.startswith('Switch') else 1
  mod=obj.modifiers.new('Surface normals','WEIGHTED_NORMAL');mod.keep_sharp=True
 return obj

def rod(name,a,b,r,mat,parent,segments=12):
 av=Vector((a[0],-a[2],a[1]));bv=Vector((b[0],-b[2],b[1]));d=bv-av
 verts=[]
 for z in [-d.length/2,d.length/2]:
  verts.extend((r*math.cos(i*math.tau/segments),r*math.sin(i*math.tau/segments),z) for i in range(segments))
 faces=[tuple(reversed(range(segments))),tuple(range(segments,2*segments))]+[(i,(i+1)%segments,(i+1)%segments+segments,i+segments) for i in range(segments)]
 data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);data.materials.append(mat)
 for poly in data.polygons: poly.use_smooth=True
 obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.parent=parent;obj.location=(av+bv)/2;obj.rotation_euler=d.to_track_quat('Z','Y').to_euler();meshes.append(obj);return obj

def bolt(parent,p,r=.045):
 rod('Recessed steel fastener',p,(p[0],p[1],p[2]+.025),r,m['steel'],parent,12)
 block('Driver slot',(p[0],p[1],p[2]+.028),(r*1.25,r*.19,.009),m['gasket'],parent)

housing=group('SwitchHousing',(5,9,0))
block('Rear isolation casing',(0,0,.09),(2.82,3.37,.34),m['gasket'],housing,.09)
block('Die cast housing',(0,0,.2),(2.74,3.29,.34),m['graphite'],housing,.1)
block('Brushed perimeter bezel',(0,0,.39),(2.54,3.09,.13),m['edge'],housing,.07)
block('Recessed faceplate',(0,0,.46),(2.37,2.92,.075),m['graphite'],housing,.045)
block('Rocker gasket',(0,0,.52),(1.82,2.39,.12),m['gasket'],housing,.085)
for x in [-1.05,1.05]:
 for y in [-1.3,1.3]: bolt(housing,(x,y,.51),.067)
for x in [-1.22,1.22]:
 for y in [-.6,-.45,-.3,.3,.45,.6]: block('Fine housing side vent',(x,y,.17),(.025,.035,.19),m['gasket'],housing,.004)
block('Rocker upper recess',(0,.93,.56),(1.61,.06,.06),m['gasket'],housing)
block('Rocker lower recess',(0,-.93,.56),(1.61,.06,.06),m['gasket'],housing)
for x in [-.6,.6]:
 rod('Cable gland',(x,-1.72,.14),(x,-1.88,.14),.12,m['edge'],housing,16)
 block('Gland relief',(x,-1.81,.14),(.27,.045,.27),m['gasket'],housing,.025)
rocker=group('SwitchRocker',(5,9,.62))
block('Rocker molded return',(0,0,-.04),(1.62,2.19,.32),m['gasket'],rocker,.085)
block('Red rocker cap',(0,0,.075),(1.55,2.12,.34),m['red'],rocker,.07)
block('Indicator stroke',(0,.66,.255),(.25,.029,.006),m['white'],rocker,.009)
block('Indicator window',(0,-.68,.257),(.29,.055,.01),m['gasket'],rocker,.012)
block('Indicator lens',(0,-.68,.267),(.23,.025,.007),m['lamp'],rocker,.007)
for x in [-.66,.66]: block('Molding seam',(x,0,.226),(.007,1.62,.008),m['red'],rocker)

warehouse=group('WarehouseCraft')
block('Concrete slab',(0,-11.21,12),(38,.42,26),m['floor'],warehouse,.06)
for x in [-12,-6,0,6,12]:block('Concrete expansion joint',(x,-10.994,12),(.017,.008,26),m['gasket'],warehouse)
for z in [5,11,17,23]:block('Cross slab joint',(0,-10.994,z),(38,.008,.017),m['gasket'],warehouse)
# The open front/right and roof allow the camera to enter; real wall panels remain behind the cutaway.
for z in [2,6,10,14,18,22]:
 block('Side insulated wall panel',(-18.8,.8,z),(.28,23.8,3.92),m['wall'],warehouse,.025)
 block('Wall panel seam',(-18.61,.8,z+1.98),(.025,23.8,.035),m['steel'],warehouse)
# I-section steel, foot plates, diagonal truss webs and cable containment.
for z in [1.5,8.5,15.5,23]:
 for x in [-18.1,18.1]:
  for dx in [-.25,.25]:block('Column flange',(x+dx,0,z),(.08,22,.65),m['steel'],warehouse,.015)
  block('Column web',(x,0,z),(.5,22,.085),m['steel'],warehouse,.01)
  block('Base plate',(x,-10.84,z),(1.1,.16,1),m['edge'],warehouse,.02)
  for dx in [-.39,.39]:
   for dz in [-.32,.32]:rod('Anchor bolt',(x+dx,-10.75,z+dz),(x+dx,-10.62,z+dz),.055,m['steel'],warehouse,8)
 for y in [10.7,11.15]:block('Roof beam flange',(0,y,z),(36.5,.08,.58),m['steel'],warehouse,.012)
 block('Roof beam web',(0,10.93,z),(36.5,.45,.06),m['steel'],warehouse)
 rod('Pitched roof chord',(-18,11.2,z),(0,13.4,z),.095,m['steel'],warehouse)
 rod('Pitched roof chord',(0,13.4,z),(18,11.2,z),.095,m['steel'],warehouse)
 for x in range(-15,16,3):
  roof_y=13.4-abs(x)*2.2/18
  rod('Truss diagonal',(x-1.5,11.2,z),(x,roof_y,z),.048,m['steel'],warehouse,8)
  rod('Truss diagonal',(x,roof_y,z),(x+1.5,11.2,z),.048,m['steel'],warehouse,8)
for x in [-11.5,12.7]:
 for dx in [-.6,.6]:block('Cable ladder rail',(x+dx,9,12),(.07,.5,23),m['steel'],warehouse,.01)
 for z in range(1,25):block('Cable ladder rung',(x,8.8,z),(1.2,.06,.08),m['steel'],warehouse)
for z in [5,12,19]:
 for x in [-12,0,12]:
  for dx in [-1.5,1.5]:rod('Light suspension',(x+dx,10.8,z),(x+dx,9.9,z),.014,m['steel'],warehouse,6)
  block('Linear fixture shell',(x,9.86,z),(3.6,.22,.65),m['graphite'],warehouse,.04)
  block('Prismatic diffuser',(x,9.72,z),(3.4,.06,.5),m['lamp'],warehouse,.03)
# Warehousing racks with believable loaded pallets and different carton batches.
for bay,(x,z) in enumerate([(-12,11),(-4.4,11),(7,11),(-12,20),(-4.4,20),(7,20)]):
 for dx in [-2.35,2.35]:
  for dz in [-1.65,1.65]:
   block('Rack upright',(x+dx,-6.5,z+dz),(.16,8.8,.16),m['rack'],warehouse,.018)
   block('Rack foot',(x+dx,-10.84,z+dz),(.38,.12,.38),m['edge'],warehouse,.02)
  for y in [-9.4,-6.2,-3]:rod('Rack side diagonal',(x+dx,y-1.4,z-1.65),(x+dx,y+1.4,z+1.65),.035,m['steel'],warehouse,6)
 for level in range(3):
  y=-10.4+level*2.8
  for dz in [-1.7,1.7]:block('Red load beam',(x,y,z+dz),(4.8,.2,.13),m['red'],warehouse,.015)
  for dx in [-1.8,0,1.8]:block('Pallet runner',(x+dx,y+.14,z),(.22,.2,3.25),m['wood'],warehouse,.01)
  for slat in range(7):block('Pallet deck board',(x,y+.3,z-1.45+slat*.48),(4.4,.1,.34),m['wood'],warehouse,.012)
  for col in range(3):
   h=1.15+((bay+level+col)%3)*.32
   px=x-1.45+col*1.45
   block('Stock carton',(px,y+.38+h/2,z),(1.29,h,2.65),m['carton2' if (bay+col)%2 else 'carton'],warehouse,.02)
   block('Packing tape',(px,y+.39+h,z),(.08,.014,2.68),m['tape'],warehouse)
   block('Carton centre seam',(px,y+.41+h,z),(.011,.006,2.67),m['wood'],warehouse)
   block('Stock label',(px-.22,y+.8,z+1.334),(.49,.28,.009),m['white'],warehouse)
   for bar in range(5):block('Label barcode',(px-.39+bar*.055,y+.8,z+1.34),(.015,.16,.005),m['graphite'],warehouse)
for x in [-16,15.3]:block('Painted aisle edge',(x,-10.984,13),(.085,.008,21),m['paint'],warehouse)
for z in [5.4,25]:block('Cross-aisle marking',(0,-10.984,z),(32,.008,.085),m['paint'],warehouse)
# Workbench, enclosure trunking, access door and steel guard details.
block('Bench cabinet',(-10,-9.5,2.4),(7,2.7,2.4),m['white'],warehouse,.035)
block('Bench top',(-10,-8.08,2.4),(7.2,.18,2.6),m['wood'],warehouse,.025)
for x in [-12.4,-10,-7.6]:
 block('Bench drawer front',(x,-9,3.62),(2.22,.6,.06),m['white'],warehouse,.02)
 block('Drawer pull',(x,-8.98,3.69),(.65,.05,.05),m['edge'],warehouse,.015)
block('Monitor',(-10,-7.2,2.6),(1.7,1.05,.1),m['graphite'],warehouse,.05)
block('Monitor glass',(-10,-7.2,2.66),(1.55,.88,.015),m['gasket'],warehouse,.02)
rod('Monitor stand',(-10,-8,2.5),(-10,-7.7,2.5),.06,m['edge'],warehouse)
for x in [-17,17]:
 block('Safety bollard',(x,-9.8,24),(.32,2.3,.32),m['paint'],warehouse,.06)
 for y in [-9.1,-9.4]:block('Bollard band',(x,y,24),(.33,.15,.33),m['gasket'],warehouse,.04)
red_material=m['red']
def routed_bundle(name, points, radius=.032):
    data=bpy.data.curves.new(name,'CURVE'); data.dimensions='3D'; data.resolution_u=6; data.bevel_depth=radius; data.bevel_resolution=2
    spline=data.splines.new('BEZIER'); spline.bezier_points.add(len(points)-1)
    for knot,p in zip(spline.bezier_points,points):
        knot.co=(p[0],-p[2],p[1]); knot.handle_left_type='AUTO'; knot.handle_right_type='AUTO'
    obj=bpy.data.objects.new(name,data); bpy.context.scene.collection.objects.link(obj); obj.parent=warehouse; data.materials.append(red_material)
    bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True); bpy.context.view_layer.objects.active=obj; bpy.ops.object.convert(target='MESH')
for i in range(6):
    d=i*.055
    routed_bundle('Power containment',[(9.47+d,-7.75,.28),(9.47+d,-8.5,.28),(11.8+d,-8.5,.28),(12.35+d,-7.9,.28),(12.35+d,8.5,.28),(12.35+d,8.82,1.4),(12.35+d,8.82,23)])
for i in range(8):
    d=i*.045
    routed_bundle('Data containment',[(11.2+d,-10.23,.28),(8,-10.23-d*.1,.28),(-10.7+d,-10.23-d*.1,.28),(-11.65+d,-9.5,.28),(-11.65+d,8.5,.28),(-11.65+d,8.82,1.4),(-11.65+d,8.82,23)])

# Apply manufactured bevels, then batch each assembly by material for realtime use.
bpy.context.view_layer.update()
for obj in meshes:
 if obj.modifiers:
  evaluated=obj.evaluated_get(bpy.context.evaluated_depsgraph_get())
  data=bpy.data.meshes.new_from_object(evaluated);obj.modifiers.clear();old=obj.data;obj.data=data
  if old.users==0:bpy.data.meshes.remove(old)
for parent in [housing,rocker,warehouse]:
 batches={}
 for obj in list(parent.children):
  if obj.type=='MESH':batches.setdefault(obj.data.materials[0].name,[]).append(obj)
 for key,objects in batches.items():
  if len(objects)==1:
   objects[0].name=parent.name+'_'+key;continue
  bpy.ops.object.select_all(action='DESELECT')
  for obj in objects:obj.select_set(True)
  bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join();bpy.context.object.name=parent.name+'_'+key
bpy.ops.object.select_all(action='DESELECT');root.select_set(True)
for obj in root.children_recursive:obj.select_set(True)
bpy.context.view_layer.objects.active=root
bpy.ops.export_scene.gltf(filepath=OUT+'/motexo-site/public/assets/motexo-craft.glb',export_format='GLB',use_selection=True,use_active_scene=True,export_apply=True)
# Editable source and a lightweight inspection camera. No offline sequence render.
camdata=bpy.data.cameras.new('Craft camera');cam=bpy.data.objects.new('Craft camera',camdata);scene.collection.objects.link(cam)
cam.location=(1,-17,10);cam.rotation_euler=(Vector((5,-.5,9))-cam.location).to_track_quat('-Z','Y').to_euler();scene.camera=cam;camdata.lens=45
scene.world=bpy.data.worlds.new('Craft studio');scene.world.use_nodes=True
background=next(n for n in scene.world.node_tree.nodes if n.type=='BACKGROUND');background.inputs['Color'].default_value=(.09,.11,.13,1);background.inputs['Strength'].default_value=.4
for name,p,power,size in [('Key',(-8,-8,18),2200,8),('Rim',(14,1,13),1500,6)]:
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj);obj.location=p;obj.rotation_euler=(Vector((5,0,7))-obj.location).to_track_quat('-Z','Y').to_euler()
scene.render.resolution_x=960;scene.render.resolution_y=640;scene.render.resolution_percentage=100
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/motexo-scene/motexo-craft.blend')
triangles=sum(len(o.data.polygons) for o in root.children_recursive if o.type=='MESH')
print(json.dumps({'assemblies':[housing.name,rocker.name,warehouse.name],'mesh_count':sum(o.type=='MESH' for o in root.children_recursive),'polygons':triangles}))
