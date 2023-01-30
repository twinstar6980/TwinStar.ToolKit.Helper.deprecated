"use strict";
/** PAM样式运算 */
var TwinStar;
(function (TwinStar) {
    var Script;
    (function (Script) {
        var ComputePAM;
        (function (ComputePAM) {
            function execute() {
                TwinStar.Console.notify('i', `请输入需要计算的PAM文件路径`, []);
                let raw_file = TwinStar.Console.string(null);
                let ripe_file = `${raw_file}.pam.computed.json`;
                TwinStar.Support.PopCapAnimation.Convert.Compute.compute_fs(raw_file, ripe_file);
                return;
            }
            ComputePAM.execute = execute;
        })(ComputePAM = Script.ComputePAM || (Script.ComputePAM = {}));
    })(Script = TwinStar.Script || (TwinStar.Script = {}));
})(TwinStar || (TwinStar = {}));
(function (TwinStar) {
    var Support;
    (function (Support) {
        var PopCapAnimation;
        (function (PopCapAnimation) {
            var Convert;
            (function (Convert) {
                var Compute;
                (function (Compute) {
                    // ------------------------------------------------
                    // ------------------------------------------------
                    function compute_sprite_slot(raw_frame, sub_sprite, image) {
                        let sprite_slot = new Array(raw_frame.length);
                        let layer_image_map = {};
                        let reference_slot_list = [];
                        raw_frame.forEach((frame, frame_index) => {
                            sprite_slot[frame_index] = {};
                            for (let remove of frame.remove) {
                                let i = reference_slot_list.findIndex((e) => (e.index === remove.index));
                                if (i === -1) {
                                    throw new Error(`layer not found : ${remove.index}`);
                                }
                                reference_slot_list.splice(i, 1);
                            }
                            for (let append of frame.append) {
                                reference_slot_list.push({
                                    index: append.index,
                                    resource: append.resource,
                                    sprite: append.sprite,
                                    start: BigInt(frame_index),
                                    transform: Convert.k_initial_transform,
                                    color: Convert.k_initial_color,
                                });
                            }
                            for (let change of frame.change) {
                                let slot = reference_slot_list.find((e) => (e.index === change.index));
                                if (slot === undefined) {
                                    throw new Error(`layer not found : ${change.index}`);
                                }
                                slot.transform = Convert.compute_standard_transform_from_variant(change.transform);
                                if (change.color !== null) {
                                    slot.color = change.color;
                                }
                            }
                            for (let slot of reference_slot_list) {
                                if (!slot.sprite) {
                                    let layer_id = `_${slot.index}`;
                                    layer_image_map[layer_id] = slot.resource;
                                    sprite_slot[frame_index][layer_id] = ({
                                        parent: [],
                                        transform: slot.transform,
                                        color: slot.color,
                                    });
                                }
                                else {
                                    if (slot.resource >= sub_sprite.length) {
                                        throw new Error(`reference invalid`);
                                    }
                                    let reference = sub_sprite[Number(slot.resource)];
                                    let target_frame = (frame_index - Number(slot.start)) % reference[0].length;
                                    for (let id in reference[0][target_frame]) {
                                        let e = reference[0][target_frame][id];
                                        let layer_id = `_${slot.index}${id}`;
                                        layer_image_map[layer_id] = reference[1][id];
                                        sprite_slot[frame_index][layer_id] = {
                                            parent: [...e.parent, slot.resource],
                                            transform: Convert.mix_transform(e.transform, slot.transform),
                                            color: slot.color,
                                        };
                                    }
                                }
                            }
                        });
                        return [sprite_slot, layer_image_map];
                    }
                    function compute_sprite_layer(sprite, layer_image, image) {
                        let result = {};
                        let computed_layer_id = new Set();
                        sprite.forEach((frame, frame_index) => {
                            for (let layer_id in frame) {
                                if (!computed_layer_id.has(layer_id)) {
                                    computed_layer_id.add(layer_id);
                                    let tail_frame = sprite.slice(frame_index);
                                    let final_layer = [];
                                    let parent_sprite = null;
                                    let duration = tail_frame.length;
                                    let image_id = layer_image[layer_id];
                                    for (let i in tail_frame) {
                                        let e = tail_frame[i];
                                        let image_layer = e[layer_id];
                                        if (image_layer === undefined) {
                                            duration = Number.parseInt(i);
                                            break;
                                        }
                                        final_layer.push({
                                            transform: image_layer.transform,
                                            color: image_layer.color,
                                        });
                                        if (parent_sprite === null) {
                                            parent_sprite = image_layer.parent;
                                        }
                                    }
                                    result[layer_id] = {
                                        image: image_id,
                                        sprite: parent_sprite,
                                        work_area: [BigInt(frame_index), BigInt(duration)],
                                        frame: final_layer,
                                    };
                                }
                            }
                        });
                        return result;
                    }
                    function sort_sprite_layer(layer) {
                        let sortedID = Object.keys(layer)
                            .map((e) => (e.slice(1).split('_').map(Number)))
                            .sort((lt, rt) => {
                            for (let i = 0; i < lt.length && i < rt.length; ++i) {
                                if (lt[i] > rt[i]) {
                                    return +1;
                                }
                                if (lt[i] < rt[i]) {
                                    return -1;
                                }
                            }
                            return 0;
                        })
                            .map((e) => ('_' + e.join('_')));
                        let result = {};
                        for (let id of sortedID) {
                            result[id] = layer[id];
                        }
                        return result;
                    }
                    function compute_sprite_frame_label(frame) {
                        let result = {};
                        frame.forEach((e, i) => {
                            if (e.label !== null) {
                                result[e.label] = BigInt(i);
                            }
                        });
                        return result;
                    }
                    function compute_sprite_frame_stop(frame) {
                        let result = [];
                        frame.forEach((e, i) => {
                            if (e.stop) {
                                result.push(BigInt(i));
                            }
                        });
                        return result;
                    }
                    function compute_sprite(sprite, slot, layer_image, image) {
                        return {
                            name: sprite.name,
                            frame_rate: sprite.frame_rate,
                            frame_count: BigInt(sprite.frame.length),
                            frame_label: compute_sprite_frame_label(sprite.frame),
                            frame_stop: compute_sprite_frame_stop(sprite.frame),
                            layer: sort_sprite_layer(compute_sprite_layer(slot, layer_image, image)),
                        };
                    }
                    function compute(animation) {
                        if (animation.main_sprite === null) {
                            throw new Error(`main script is null`);
                        }
                        let image = animation.image.map((e) => ({
                            source: e.name.split('|')[0],
                            size: e.size,
                            transform: e.transform,
                        }));
                        let sprite_slot = [];
                        let sprite = [];
                        for (let e of animation.sprite) {
                            let slot = compute_sprite_slot(e.frame, sprite_slot, animation.image);
                            sprite_slot.push(slot);
                            sprite.push(compute_sprite(e, slot[0], slot[1], animation.image));
                        }
                        let main_sprite_slot = compute_sprite_slot(animation.main_sprite.frame, sprite_slot, animation.image);
                        let main_sprite = compute_sprite(animation.main_sprite, main_sprite_slot[0], main_sprite_slot[1], animation.image);
                        return {
                            frame_rate: animation.frame_rate,
                            position: animation.position,
                            size: animation.size,
                            image: image,
                            sprite: sprite,
                            main_sprite: main_sprite,
                        };
                    }
                    Compute.compute = compute;
                    // ------------------------------------------------
                    function compute_fs(raw_file, ripe_file) {
                        let raw = TwinStar.CoreX.JSON.read_fs_js(raw_file);
                        let ripe = compute(raw);
                        TwinStar.CoreX.JSON.write_fs_js(ripe_file, ripe, true, true);
                        return;
                    }
                    Compute.compute_fs = compute_fs;
                    // ------------------------------------------------
                })(Compute = Convert.Compute || (Convert.Compute = {}));
            })(Convert = PopCapAnimation.Convert || (PopCapAnimation.Convert = {}));
        })(PopCapAnimation = Support.PopCapAnimation || (Support.PopCapAnimation = {}));
    })(Support = TwinStar.Support || (TwinStar.Support = {}));
})(TwinStar || (TwinStar = {}));
TwinStar.Script.ComputePAM.execute();
