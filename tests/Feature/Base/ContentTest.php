<?php


namespace Base;

use App\Http\Enums\EPermissions;
use App\Models\Base\Content;
use App\Models\Base\ContentLanguage;
use App\Models\Base\ContentType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;
use Tests\ERole;
use Tests\TestCase;

class ContentTest extends TestCase
{
  use WithFaker, RefreshDatabase;

  protected function setUp(): void
  {
    parent::setUp();
    $this->withoutMiddleware(\App\Http\Middleware\FrontendCaseMiddleware::class);
  }

  public function test_super_admin()
  {
    $this->base(ERole::SUPER_ADMIN);
  }

  public function test_admin()
  {
    $this->base(ERole::ADMIN, [
      EPermissions::P_CONTENT_TYPE_INDEX->value,
      EPermissions::P_CONTENT_TYPE_STORE->value,
      EPermissions::P_CONTENT_TYPE_SHOW->value,
      EPermissions::P_CONTENT_TYPE_UPDATE->value,
      EPermissions::P_CONTENT_TYPE_DESTROY->value,

      EPermissions::P_CONTENT_INDEX->value,
      EPermissions::P_CONTENT_STORE->value,
      EPermissions::P_CONTENT_SHOW->value,
      EPermissions::P_CONTENT_UPDATE->value,
      EPermissions::P_CONTENT_DESTROY->value,
    ]);
  }

  public function test_user()
  {
    $this->base(ERole::USER);
  }

  private function base(ERole $eRole, $permissions = []): void
  {
    $auth = $this->signIn($eRole, $permissions);
    $type = ContentType::factory()->raw();
    $res = $this->post('/api/contents/types/', $type)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertDatabaseHas('content_types', $type);
      $type['id'] = $res['id'];
    }

    $res = $this->get('/api/contents/types/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      $check = false;
      foreach ($res['data'] as $item) {
        if ($item['id'] == $type['id']) {
          foreach ($type as $key => $value) {
            $check = true;
            $this->assertEquals($value, $item[Str::camel($key)]);
          }
        }
      }
      $this->assertTrue($check);
    }

    if ($eRole !== ERole::USER) {
      $this->assertDatabaseHas('content_types', [...$type, 'disabled_at' => null]);
      $this->put('/api/contents/types/' . $res['data'][0]['code'], ['is_disable' => true])->assertStatus(200);
      $this->assertDatabaseMissing('content_types', [...$type, 'disabled_at' => null]);
    }

    $type = ContentType::factory()->raw(['code' => $type['code']]);
    $this->put('/api/contents/types/' . $type['code'], $type)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseHas('content_types', $type);

    $data = Content::factory()->raw(['type_code' => $type['code']]);
    $data['languages'] = ContentLanguage::factory(2)->raw();

    $res = $this->post('/api/contents/', $data)->assertStatus($eRole !== ERole::USER ? 201 : 403);
    if ($eRole !== ERole::USER) {
      unset($data['languages']);
      $this->assertDatabaseHas('contents', $data);
      $data['id'] = $res['id'];
    }

    $res = $this->get('/api/contents/')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      $this->assertCount(1, $res['data']);
      $check = false;
      foreach ($res['data'] as $item) {
        if ($item['name'] == $data['name']) {
          foreach ($data as $key => $value) {
            $check = true;
            $this->assertEquals($value, $item[Str::camel($key)]);
          }
        }
      }
      $this->assertTrue($check);
    }

    if ($eRole === ERole::USER) $data = Content::factory()->create()->getAttributes();
    $id = $eRole !== ERole::USER ? $res['data'][0]['id'] : $data['id'];
    $res = $this->get('/api/contents/' . $id . '?include=type,languages')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach ($data as $key => $value) {
        $this->assertEquals($value, $res['data'][Str::camel($key)]);
      }
      foreach ($type as $key => $value) {
        $this->assertEquals($value, $res['data']['type'][Str::camel($key)]);
      }
    }

    if ($eRole !== ERole::USER) $this->assertDatabaseHas('contents', [...$data, 'disabled_at' => null]);
    $res = $this->put('/api/contents/' . $id, ['is_disable' => true])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('contents', [...$data, 'disabled_at' => null]);

    $data = Content::factory()->raw(['type_code' => $type['code']]);
    if (property_exists($res, 'data')) {
      $data['languages'] = [];
      array_push(
        $data['languages'],
        ContentLanguage::factory()->raw(["id" => $res['data']['languages'][0]['id']]),
        ContentLanguage::factory()->raw(["id" => $res['data']['languages'][1]['id']])
      );
    }
    $this->put('/api/contents/' . $id, $data)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      unset($data['languages']);
      $this->assertDatabaseHas('contents', $data);
    }

    $res = $this->get('/api/contents/types/' . $type['code'] . '?include=contents')->assertStatus($eRole !== ERole::USER ? 200 : 403);
    if ($eRole !== ERole::USER) {
      foreach ($data as $key => $value) {
        $this->assertEquals($value, $res['data']['contents'][0][Str::camel($key)]);
      }
    }

    $this->delete('/api/contents/' . $id)->assertStatus($eRole !== ERole::USER ? 200 : 403);
    $data['deleted_at'] = null;
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('contents', $data);

    $this->delete('/api/contents/types/' . $type['code'])->assertStatus($eRole !== ERole::USER ? 200 : 403);
    $type['deleted_at'] = null;
    if ($eRole !== ERole::USER) $this->assertDatabaseMissing('content_types', $type);
  }
}
